// Global array to store ad data loaded from JSON
let allAds = [];

// Load ads from JSON file on page load
fetch('ads-display.json?v=' + new Date().getTime())
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

	const categoryFilter = document.getElementById('category-input').value.trim().toUpperCase();
	const countryFilter  = document.getElementById('country-input').value.trim().toUpperCase();
	const stateFilter    = document.getElementById('state-input').value.trim().toUpperCase();
	const cityFilter     = document.getElementById('city-input').value.trim().toUpperCase();
	const suburbFilter   = document.getElementById('suburb-input').value.trim().toUpperCase();

	const filteredAds = allAds.filter(ad =>
		ad.category.toUpperCase().includes(categoryFilter) &&
		ad.country.toUpperCase().includes(countryFilter) &&
		ad.state.toUpperCase().includes(stateFilter) &&
		ad.city.toUpperCase().includes(cityFilter) &&
		ad.suburb.toUpperCase().includes(suburbFilter)
	);

	if (filteredAds.length === 0)
	{
		board.innerHTML = '<p>No ads found for this selection.</p>';
		return;
	}

	filteredAds.forEach(ad =>
	{
		let card;

		if (ad.expandable)
		{
			card = document.createElement('details');
			card.classList.add('ad-card', 'expandable');

			const summary = document.createElement('summary');
			summary.innerHTML = `
				<img src="${ad.image}" alt="${ad.name} Card" class="ad-image">
				<h4>${ad.name}</h4>
				<p>${ad.blurb}</p>
				<a href="${ad.url}" target="_blank">Visit Site</a>
			`;

			const extraText = document.createElement('p');
			extraText.classList.add('expanded-text');
			extraText.innerHTML = ad.expandedText || '';

			card.appendChild(summary);
			card.appendChild(extraText);
		}
		else
		{
			card = document.createElement('div');
			card.classList.add('ad-card');
			card.innerHTML = `
				<img src="${ad.image}" alt="${ad.name} Card" class="ad-image">
				<h4>${ad.name}</h4>
				<p>${ad.blurb}</p>
				<a href="${ad.url}" target="_blank">Visit Site</a>
			`;
		}

		// Apply highlight or custom color
		if (ad.highlight)
		{
			card.classList.add('highlight');
			if (ad.color)
			{
				card.style.backgroundColor = ad.color;
			}
		}

		board.appendChild(card);
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

document.addEventListener('DOMContentLoaded', () =>
{
	fetch('ads-display.json')
		.then(response => response.json())
		.then(data =>
		{
			allAds = data; // Store all ads globally if needed for filtering
			renderAds(allAds); // Display all ads initially
		})
		.catch(error => console.error("Failed to load ads:", error));
});
