// hcards.js

// Load home cards from JSON, build both the home‑panel cards and their matching "page‑" sections
function loadHomeCards() {
	fetch('home-cards.json')
	  .then(res => res.json())
	  .then(cards => {
		const container     = document.getElementById('home-cards-container');
		const pageContainer = document.querySelector('.page-container');
  
		cards.forEach(card => {
		  // --- 1) Build the little card on the home panel ---
		  const div = document.createElement('div');
		  div.classList.add('home-card');
		  div.dataset.target = card.id;
		  div.innerHTML = `
			<h3>${card.title}</h3>
			<p>${card.description}</p>
		  `;
		  container.appendChild(div);
  
		  // --- 2) Build the hidden section for that card's content ---
		  const section = document.createElement('section');
		  section.id        = `page-${card.id}`;      // ◀️ prefix ID with "page-"
		  section.className = 'page';
		  const header = document.createElement('h2');
		  header.textContent = card.title;
		  section.appendChild(header);
  
		  if (Array.isArray(card.entries) && card.entries.length) {
			card.entries.forEach(entry => {
			  const details = document.createElement('details');
			  details.className = 'card-entry';
			  const summary = document.createElement('summary');
			  // two possible entry shapes: {author,text} or {theme,verse,text}
			  if (entry.author) {
				summary.textContent = entry.author;
				details.appendChild(summary);
				const block = document.createElement('blockquote');
				block.innerHTML = entry.text;
				details.appendChild(block);
			  } else if (entry.verse) {
				summary.textContent = `${entry.theme} – ${entry.verse}`;
				details.appendChild(summary);
				const para = document.createElement('p');
				para.innerHTML = entry.text;
				details.appendChild(para);
			  }
			  section.appendChild(details);
			});
		  } else {
			const p = document.createElement('p');
			p.textContent = 'Nothing here just yet... stay tuned!';
			section.appendChild(p);
		  }
  
		  pageContainer.appendChild(section);
		});
  
		// --- 3) Wire up clicks on the home‑panel cards to change the hash ---
		container.querySelectorAll('.home-card').forEach(cardDiv => {
		  cardDiv.addEventListener('click', () => {
			const targetId = cardDiv.dataset.target;
			// set the hash (e.g. #advice), site-navigation.js will pick this up
			window.location.hash = targetId;
		  });
		});
	  })
	  .catch(err => console.error('Failed to load home cards:', err));
  }
  
  // Initialize on DOM ready
  document.addEventListener('DOMContentLoaded', loadHomeCards);
  