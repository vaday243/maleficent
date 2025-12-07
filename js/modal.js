/* modal.js
   Handles password modal open/close and passphrase validation.
   Exposes `showModal` and `revealLetter` to global scope for main.js use.
*/

(function(window, Utils){
  const PASS_PHRASE = "Aurora"; // <- change to your passphrase here
  const modal = Utils.$('#passwordModal');
  const passInput = modal ? modal.querySelector('#passInput') : null;
  const passSubmit = modal ? modal.querySelector('#passSubmit') : null;
  const passCancel = modal ? modal.querySelector('#passCancel') : null;
  const letterEl = Utils.$('#letterText');

  // ensure modal exists
  function initModal(){
    if(!modal) return;
    // ensure hidden on first load
    modal.classList.add('hidden');
    modal.setAttribute('aria-hidden', 'true');

    // click outside to close
    modal.addEventListener('click', (e) => {
      if(e.target === modal) showModal(false);
    });

    // keyboard: Esc to close
    document.addEventListener('keydown', (e) => {
      if(e.key === 'Escape' && !modal.classList.contains('hidden')) showModal(false);
    });

    // hook buttons
    if(passSubmit) passSubmit.addEventListener('click', checkPassphrase);
    if(passCancel) passCancel.addEventListener('click', ()=> showModal(false));
  }

  function showModal(show = true){
  if(!modal) return;
  if(show){
    // Make visible: remove hidden attribute/class and set aria
    modal.classList.remove('hidden');
    if(modal.hasAttribute('hidden')) modal.removeAttribute('hidden');
    modal.setAttribute('aria-hidden','false');
    // focus input after small delay
    setTimeout(()=> { passInput && passInput.focus(); }, 60);
  } else {
    // Hide modal: add hidden attribute & class and update aria
    modal.classList.add('hidden');
    modal.setAttribute('hidden', '');
    modal.setAttribute('aria-hidden','true');
    // return focus to start button for accessibility
    const start = Utils.$('#startBtn');
    start && start.focus();
  }
}


  function checkPassphrase(){
    if(!passInput) return;
    const val = passInput.value.trim();
    if(val === PASS_PHRASE){
      // reveal letter and close modal
      revealLetter();
      showModal(false);
      // clear input for next time
      passInput.value = '';
    } else {
      // gentle feedback
      Utils.toast('Wrong passphrase. Check the card and try again.');
      passInput.focus();
    }
  }

  function revealLetter(){
    if(!letterEl) return;
    letterEl.style.display = 'block';
    letterEl.setAttribute('aria-hidden','false');
    // animate reveal if not reduced-motion
    if(!Utils.prefersReducedMotion()){
      if(window.gsap){
        gsap.fromTo(letterEl, {opacity:0, y:10}, {opacity:1, y:0, duration:0.6, ease:'power1.out'});
      } else {
        letterEl.style.opacity = 1;
      }
    } else {
      letterEl.style.opacity = 1;
    }
    // scroll into view
    setTimeout(()=> {
      const section = Utils.$('#letterScene');
      section && section.scrollIntoView({behavior: 'smooth'});
    }, 250);
  }

  // expose functions globally used by other modules (main.js)
  window.__Modal = {
    init: initModal,
    showModal,
    checkPassphrase,
    revealLetter
  };

})(window, window.__Utils);
