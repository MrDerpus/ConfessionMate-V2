// Converts a string to an ArrayBuffer (UTF-8)
function strToBuffer(str)
{
	return new TextEncoder().encode(str);
}

// Converts ArrayBuffer to hex string
function bufferToHex(buffer)
{
	const bytes = new Uint8Array(buffer);
	return Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
}

// Converts hex string back to ArrayBuffer
function hexToBuffer(hex)
{
	const bytes = new Uint8Array(hex.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));
	return bytes.buffer;
}

// Derives a 256-bit AES key from a passcode using your custom equation
async function deriveKey(passcode)
{
	const passInt = parseInt(passcode);
	const equationResult = (passInt * passInt) * (passInt + passInt) + (passInt * passInt);
	const hashBuffer = await crypto.subtle.digest('SHA-256', strToBuffer(equationResult.toString()));

	return crypto.subtle.importKey(
		'raw',
		hashBuffer,
		{ name: 'AES-CBC' },
		false,
		['encrypt', 'decrypt']
	);
}

// Derives a 16-byte IV from a secret word (UTF-8 padded or sliced)
function deriveIV(secret)
{
	const encoder = new TextEncoder();
	let iv = encoder.encode(secret);

	// Ensure it's exactly 16 bytes
	if (iv.length > 16)
	{
		iv = iv.slice(0, 16);
	}
	else if (iv.length < 16)
	{
		const padding = new Uint8Array(16 - iv.length);
		iv = new Uint8Array([...iv, ...padding]);
	}

	return iv;
}

// Encrypts text, returns compressed base64 string (shorter for copy/paste)
async function encryptCompressed(text, passcode, secret)
{
	// Compress the plaintext first
	const compressedText = LZString.compressToUTF16(text);
	const key = await deriveKey(passcode);
	const iv = deriveIV(secret);
	const encodedText = strToBuffer(compressedText);

	const encrypted = await crypto.subtle.encrypt(
		{ name: 'AES-CBC', iv },
		key,
		encodedText
	);

	const hex = bufferToHex(encrypted);
	return LZString.compressToBase64(hex);
}

// Decrypts compressed ciphertext and decompresses the resulting plaintext
async function decryptCompressed(compressedText, passcode, secret)
{
	try
	{
		// console.log("Step 1: decompress base64");
		const hex = LZString.decompressFromBase64(compressedText);

		if (!hex || hex.length < 32)
			throw new Error("Decompressed hex is invalid or too short");

		// console.log("Step 2: convert hex to buffer");
		const encryptedBuffer = hexToBuffer(hex);

		// console.log("Step 3: derive key/IV");
		const key = await deriveKey(passcode);
		const iv = deriveIV(secret);

		// console.log("Step 4: decrypt AES");
		const decrypted = await crypto.subtle.decrypt(
			{ name: 'AES-CBC', iv },
			key,
			encryptedBuffer
		);

		//console.log("Step 5: decode buffer to UTF-16 string");
		const utf16 = new TextDecoder().decode(decrypted);

		//console.log("Step 6: decompress UTF-16");
		const result = LZString.decompressFromUTF16(utf16);

		if (!result)
			throw new Error("Failed to decompress decrypted text");

		
		return result;
	}
	catch (err)
	{
		console.error("Decryption failed:", err);
		throw err;
	}
}