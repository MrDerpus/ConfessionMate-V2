//alert('WARNING! this site is still under construction, and everything you see is subject to change.')

// Global array to store ad data loaded from JSON
let allAds = [];

// Load ads from JSON file on page load
fetch('ads-display.json')
	.then(response => response.json())
	.then(data => {
		allAds = data;
		renderAds(); // initial render with no filters
	});

// Renders the ad board based on current filter input values
function renderAds()
{
	const board = document.getElementById('ad-board');
	board.innerHTML = '';

	// Read and normalize input values
	const categoryFilter = document.getElementById('category-input').value.trim().toUpperCase();
	const countryFilter  = document.getElementById('country-input').value.trim().toUpperCase();
	const stateFilter    = document.getElementById('state-input').value.trim().toUpperCase();
	const cityFilter     = document.getElementById('city-input').value.trim().toUpperCase();
	const suburbFilter   = document.getElementById('suburb-input').value.trim().toUpperCase();

	// Filter ads by all criteria (case-insensitive includes)
	const filteredAds = allAds.filter(ad =>
		ad.category.toUpperCase().includes(categoryFilter) &&
		ad.country.toUpperCase().includes(countryFilter) &&
		ad.state.toUpperCase().includes(stateFilter) &&
		ad.city.toUpperCase().includes(cityFilter) &&
		ad.suburb.toUpperCase().includes(suburbFilter)
	);

	// Display message if no ads match the filters
	if (filteredAds.length === 0)
	{
		board.innerHTML = '<p>No ads found for this selection.</p>';
		return;
	}

	// Render matching ad cards
	filteredAds.forEach(ad => {
		const adCard = document.createElement('div');
		adCard.classList.add('ad-card');
		adCard.innerHTML = `
			<img src="${ad.image}" alt="${ad.name} Card" class="ad-image">
			<h4>${ad.name}</h4>
			<p>${ad.blurb}</p>
			<a href="${ad.url}" target="_blank">Visit Site</a>
		`;
		board.appendChild(adCard);
	});
}

// Attach event listeners for all filter inputs
document.getElementById('category-input').addEventListener('input', renderAds);
document.getElementById('country-input').addEventListener('input', renderAds);
document.getElementById('state-input').addEventListener('input', renderAds);
document.getElementById('city-input').addEventListener('input', renderAds);
document.getElementById('suburb-input').addEventListener('input', renderAds);

// Toggle visibility of filter section on button click
document.getElementById('toggle-filters').addEventListener('click', () => {
	const container = document.getElementById('filter-container');
	container.classList.toggle('hidden');
});



// Load home cards
function loadHomeCards()
{
	fetch('home-cards.json')
		.then(res => res.json())
		.then(cards =>
		{
			const container = document.getElementById('home-cards-container');
			const pageContainer = document.querySelector('.page-container');

			cards.forEach(card =>
			{
				// --- Create the home card ---
				const div = document.createElement('div');
				div.classList.add('home-card');
				div.setAttribute('data-target', card.id);
				div.innerHTML = `<h3>${card.title}</h3><p>${card.description}</p>`;
				container.appendChild(div);

				// --- Create matching section for card content ---
				const section = document.createElement('section');
				section.id = card.id;
				section.className = 'page';

				const header = document.createElement('h2');
				header.textContent = card.title;
				section.appendChild(header);

				// --- If entries exist, create content blocks ---
				if (card.entries && Array.isArray(card.entries))
				{
					card.entries.forEach(entry =>
					{
						const block = document.createElement('details');
						block.className = 'card-entry';
					
						const summary = document.createElement('summary');
					
						if (entry.author)
						{
							//summary.textContent = `Advice from ${entry.author}`;
							summary.textContent = `${entry.author}`;
							block.appendChild(summary);
					
							const quote = document.createElement('blockquote');
							quote.innerHTML = entry.text;
							block.appendChild(quote);
						}
						else if (entry.verse)
						{
							summary.textContent = `${entry.theme} – ${entry.verse}`;
							block.appendChild(summary);
					
							const para = document.createElement('p');
							//const para = document.createElement('pre');
							para.innerHTML = entry.text;
							block.appendChild(para);
						}
					
						section.appendChild(block);
					});
				}
				else
				{
					// Optional message for sections without entries
					const p = document.createElement('p');
					p.textContent = "Nothing here just yet... stay tuned!";
					section.appendChild(p);
				}

				pageContainer.appendChild(section);
			});

			// --- Click handler for cards ---
			document.querySelectorAll('.home-card').forEach(card =>
			{
				card.addEventListener('click', () =>
				{
					const targetId = card.getAttribute('data-target');
					const targetPage = document.getElementById(targetId);

					if (targetPage)
					{
						document.querySelectorAll('.page').forEach(page =>
						{
							page.classList.remove('active');
						});
						targetPage.classList.add('active');
					}
				});
			});
		});
}
document.addEventListener('DOMContentLoaded', loadHomeCards);














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
						setTimeout(() =>
						{
							const input = document.getElementById('last-confession');
							console.log("Post-delay value still:", input.value);
							input.focus();
							input.blur();
						}, 300);
					}
					else
					{
						const parsedDate = new Date(date);
						if (!isNaN(parsedDate))
						{
							dateInput.value = parsedDate.toISOString().split('T')[0];
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
	



// How long has it been since the their last confession?
document.getElementById('last-confession').addEventListener('change', updateElapsedTime);

function updateElapsedTime()
{
	const dateInput = document.getElementById('last-confession').value;
	const output = document.getElementById('confession-elapsed');

	if (!dateInput)
	{
		output.textContent = '';
		return;
	}

	const selectedDate = new Date(dateInput);
	const today = new Date();

	// Clear the time portions
	selectedDate.setHours(0, 0, 0, 0);
	today.setHours(0, 0, 0, 0);

	const diffTime = today.getTime() - selectedDate.getTime();
	const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
	const weeks = Math.floor(diffDays / 7);
	const days = diffDays % 7;

	if (diffDays < 0)
	{
		output.textContent = "That date is in the future.";
	}
	else if (diffDays === 0)
	{
		output.textContent = "Today is your confession day!";
	}
	else
	{
		let message = "It has been ";
		if (weeks > 0) message += `${weeks} week${weeks > 1 ? 's' : ''}`;
		if (weeks > 0 && days > 0) message += " and ";
		if (days > 0) message += `${days} day${days > 1 ? 's' : ''}`;
		message += " since your last confession.";
		output.textContent = message;
	}
}
document.getElementById('last-confession').addEventListener('change', updateElapsedTime);
window.addEventListener('DOMContentLoaded', () =>
{
	updateElapsedTime(); // Updates on page load if a value is present
});



function showPage(pageId)
{
	//console.log("Showing page:", pageId);
	const fullId = `page-${pageId}`;
	document.querySelectorAll('.page').forEach(page =>
	{
		page.classList.remove('active');
	});

	const page = document.getElementById(fullId);
	if (page)
	{
		page.classList.add('active');
		window.scrollTo(0, 0);
	}
	else
	{
		console.warn(`No page section found for id: ${fullId}`);
	}
}

function getCurrentPageFromHash()
{
	return window.location.hash.replace('#', '') || 'home';
}

// Load correct section on first load
window.addEventListener('DOMContentLoaded', () =>
{
	setTimeout(() =>
	{
		showPage(getCurrentPageFromHash());
	}, 10);
});

// Respond to back/forward hash navigation
window.addEventListener('hashchange', () =>
{
	showPage(getCurrentPageFromHash());
});

// Force showPage even if the user clicks the same tab
document.querySelectorAll('nav a[data-target]').forEach(link =>
{
	link.addEventListener('click', (e) =>
	{
		const target = link.getAttribute('data-target');
		const current = getCurrentPageFromHash();

		// If we're clicking the same tab again
		if (current === target)
		{
			e.preventDefault(); // prevent anchor scrolling
			showPage(target);   // force it
		}
	});
});
	