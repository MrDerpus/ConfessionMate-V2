/**
 * Site Navigation
 */

function showPage(pageId) {
	const fullId = `page-${pageId}`;
	// hide every page
	document.querySelectorAll('.page').forEach(p => {
		p.classList.remove('active');
	});
	// show the one we want
	const page = document.getElementById(fullId);
	if (page) {
		page.classList.add('active');
		// reset scroll
		window.scrollTo(0, 0);
	} else {
		console.warn(`No page section found for id: ${fullId}`);
	}
}

function getCurrentPageFromHash() {
	// strip leading “#”, default to “home”
	const hash = window.location.hash.replace(/^#/, '');
	return hash || 'home';
}

window.addEventListener('DOMContentLoaded', () => {
	// 1) on load, show the page matching the URL
	showPage(getCurrentPageFromHash());

	// 2) intercept every nav link click
	document.querySelectorAll('nav a[data-target]').forEach(link => {
		link.addEventListener('click', e => {
			e.preventDefault();
			const target = link.getAttribute('data-target');
			// push a new history state (changes URL without jump)
			history.pushState(null, '', `#${target}`);
			// actually show it
			showPage(target);
		});
	});

	// 3) handle back/forward buttons
	window.addEventListener('popstate', () => {
		showPage(getCurrentPageFromHash());
	});
});
