/* cards.js
   Manage the cards deck interactions (expand/collapse) and print behavior.
*/

(function(window, Utils){
  const deck = Utils.$('#cardsDeck');

  function init(){
    if(!deck) return;
    // If cards are provided in HTML, just attach behavior, else inject sample ones
    if(deck.children.length === 0){
      // inject default cards markup (keeps it editable later)
      const cards = [
        {k:'coffee', t:'Coffee Card', d:'Valid for one coffee break — your terms.'},
        {k:'asshole', t:'Asshole Card', d:'Use when I mess up. I show up. No debates.'},
        {k:'car', t:'Car Ride Card', d:'One long drive — your playlist. Missing turns included.'},
        {k:'rain', t:'Rain Check', d:'One spontaneous moment. Preferably with less mud.'}
      ];
      cards.forEach(c => {
        const el = document.createElement('div');
        el.className = 'card';
        el.tabIndex = 0;
        el.dataset.type = c.k;
        el.innerHTML = `<div><div class="title">${c.t}</div><div class="desc">${c.d}</div></div>`;
        deck.appendChild(el);
      });
    }

    // attach click + keyboard handlers
    Array.from(deck.children).forEach(card => {
      card.addEventListener('click', ()=> toggle(card) );
      card.addEventListener('keydown', (e)=> {
        if(e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(card); }
      });
    });
  }

  function toggle(card){
    const expanded = card.classList.contains('expanded');
    // collapse all first
    Utils.$$('.card.expanded', deck).forEach(c => c.classList.remove('expanded'));
    if(!expanded) card.classList.add('expanded');
  }

  // print handler: prints just the cards
  function printCards(){
    window.print();
  }

  window.__Cards = { init, printCards };

})(window, window.__Utils);
