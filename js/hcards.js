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