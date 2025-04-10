// set default values for all relevant options
const checkbox_confession = document.getElementById('notes-mode');
const button_confession = document.getElementById('confession-button');
const modeLabel   = document.getElementById('mode-label');
checkbox_confession.checked = true;
button_confession.innerText = modeLabel.innerText;


checkbox_confession.addEventListener('change', () =>
{
	modeLabel.textContent = checkbox_confession.checked ? "Encrypt" : "Decrypt";
	button_confession.innerText = modeLabel.innerText;
});



function showAuthModal(callback)
{
	const modal = document.getElementById('auth-modal');
	const pinInput = document.getElementById('pin-input');
	const secretInput = document.getElementById('secret-input');
	const submitBtn = document.getElementById('auth-submit');
	const cancelBtn = document.getElementById('auth-cancel');

	function closeModal()
	{
		modal.classList.add('hidden');
		document.removeEventListener('keydown', handleEscape);
	}

	function handleEscape(e)
	{
		if(e.key === 'Escape')
		{
			closeModal();
		}
	}

	pinInput.value = '';
	secretInput.value = '';
	modal.classList.remove('hidden');
	pinInput.focus();

	document.addEventListener('keydown', handleEscape);

	submitBtn.onclick = () =>
	{
		const passcode = pinInput.value.trim();
		const secret = secretInput.value.trim();

		if (passcode.length !== 4 || isNaN(passcode))
		{
			alert("Please enter a valid 4-digit passcode.");
			return;
		}
		if (!secret)
		{
			alert("Please enter your secret word.");
			return;
		}

		closeModal();
		callback(passcode, secret);
	};

	cancelBtn.onclick = () =>
	{
		closeModal();
	};
}




const DELIMITER = '<57ad393d-5272-44a3-85b7-130ee5462848>';

document.getElementById('confession-button').addEventListener('click', () =>
{
	showAuthModal((passcode, secret) =>
	{
		const isEncrypting = document.getElementById('notes-mode').checked;

		if (isEncrypting)
		{
			const notesText = document.getElementById('confession-notes').value.trim();
			const confessionDate = document.getElementById('last-confession').value.trim();

			if (!notesText || !confessionDate)
			{
				alert("Please enter both a date and your notes.");
				return;
			}

			const payload = `${confessionDate}${DELIMITER}${notesText}`;

			encryptCompressed(payload, passcode, secret)
				.then(result =>
				{
					document.getElementById('confession-notes').value = result;
				})
				.catch(() =>
				{
					alert("Encryption failed.");
				});
		}
		else
		{
			const encryptedText = document.getElementById('confession-notes').value.trim();

			decryptCompressed(encryptedText, passcode, secret)
				.then(result =>
				{
					if (!result.includes(DELIMITER))
					{
						alert("Decryption succeeded but format is invalid.");
						return;
					}

					const [date, notes] = result.split(DELIMITER);
					const dateInput = document.getElementById('last-confession');
					


					// Direct assignment if already ISO format (YYYY-MM-DD)
					if (/^\d{4}-\d{2}-\d{2}$/.test(date))
					{
						dateInput.value = date;
						console.log("Setting last-confession to:", date);
					
						setTimeout(() => {
							const input = document.getElementById('last-confession');
							console.log("Post-delay value still:", input.value);
							input.focus();
							input.blur();
					
							requestAnimationFrame(() => {
								console.log("✅ Triggering updateElapsedTime from ISO block");
								updateElapsedTime();
							});
						}, 100);
					}
					else
					{
						const parsedDate = new Date(date);
						if (!isNaN(parsedDate))
						{
							dateInput.value = parsedDate.toISOString().split('T')[0];
							setTimeout(() => {
								requestAnimationFrame(() => {
									console.log("🛠 Calling updateElapsedTime after layout and frame");
									updateElapsedTime();
								});
							}, 50);
						}
						else
						{
							dateInput.value = '';
							console.warn("Unable to parse confession date:", date);
						}
					}

					document.getElementById('confession-notes').value = notes;
				})
				.catch(() =>
				{
					alert("Incorrect code or corrupted input.");
				});
		}
	});
});




document.getElementById('copy-button').addEventListener('click', async () =>
{
	const textarea = document.getElementById('confession-notes');
	const status = document.getElementById('copy-status');

	if (!textarea.value.trim())
	{
		alert("Nothing to copy.");
		return;
	}

	if (!navigator.clipboard)
	{
		alert("Clipboard not supported in this browser.");
		return;
	}

	try
	{
		await navigator.clipboard.writeText(textarea.value);

		if (status)
		{
			status.style.display = 'inline';
			setTimeout(() =>
			{
				status.style.display = 'none';
			}, 1500);
		}
	}
	catch (err)
	{
		console.error("Copy failed:", err);
		alert("Failed to copy to clipboard.");
	}
});

	
	


// copy button for text area input in notes/confession
document.getElementById('copy-button').addEventListener('click', () =>
{
	const textarea = document.getElementById('confession-notes');

	if (!textarea.value.trim())
	{
		alert("Nothing to copy.");
		return;
	}

	navigator.clipboard.writeText(textarea.value).then(() =>
	{
		showToast(); // ← this replaces the old status span
	}).catch(err =>
	{
		alert("Failed to copy.");
		console.error(err);
	});
});
	
	



function showToast(message = "Copied to clipboard")
{
	const toast = document.getElementById('toast');
	toast.textContent = message;
	toast.classList.add('show');
	toast.classList.remove('hidden');

	setTimeout(() =>
	{
		toast.classList.remove('show');
	}, 2500);
}
