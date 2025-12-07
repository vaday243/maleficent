/* utils.js
   Small helpers used across modules.
*/

(function(window){

  const Utils = {
    // detect reduced motion preference
    prefersReducedMotion() {
      return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    },

    // simple toast (transient message) used for micro feedback
    toast(message, timeout = 2000) {
      const t = document.createElement('div');
      t.className = 'toast';
      t.textContent = message;
      document.body.appendChild(t);
      setTimeout(()=> {
        t.style.opacity = '0';
        setTimeout(()=> t.remove(), 300);
      }, timeout);
    },

    // safe query helper
    $: (sel, ctx=document) => ctx.querySelector(sel),
    $$: (sel, ctx=document) => Array.from(ctx.querySelectorAll(sel)),

    // debounce helper
    debounce(fn, ms=100){
      let t;
      return (...a)=>{
        clearTimeout(t);
        t = setTimeout(()=> fn(...a), ms);
      };
    }
  };

  window.__Utils = Utils;
})(window);
