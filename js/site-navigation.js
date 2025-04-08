// 
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