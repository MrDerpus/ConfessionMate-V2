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
	const countryFilter = document.getElementById('country-input').value.trim().toUpperCase();
	const stateFilter = document.getElementById('state-input').value.trim().toUpperCase();
	const cityFilter = document.getElementById('city-input').value.trim().toUpperCase();
	const suburbFilter = document.getElementById('suburb-input').value.trim().toUpperCase();

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

// Navigation: show only the selected section, hide others
document.querySelectorAll('nav a').forEach(link => {
	link.addEventListener('click', e => {
		e.preventDefault();
		const target = link.getAttribute('data-target');

		document.querySelectorAll('.page').forEach(page => {
			page.classList.remove('active');
		});

		document.getElementById(target).classList.add('active');
	});
});
