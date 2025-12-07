/* rain.js
   Canvas-based subtle rain animation.
   Self-contained and defensive.
*/

(function(window, Utils){
  let canvas, ctx, DPR, drops = [], raf;
  const init = () => {
    canvas = Utils.$('#rainCanvas');
    if(!canvas) return;
    if(Utils.prefersReducedMotion()) return; // skip if user prefers reduced motion

    ctx = canvas.getContext('2d');
    DPR = window.devicePixelRatio || 1;
    resize();
    buildDrops();
    loop();
    window.addEventListener('resize', Utils.debounce(() => {
      resize();
      buildDrops();
    }, 160));
  };

  function resize(){
    if(!canvas) return;
    canvas.width = canvas.clientWidth * DPR;
    canvas.height = canvas.clientHeight * DPR;
    ctx && ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  }

  function buildDrops(){
    if(!canvas) return;
    drops = [];
    const count = Math.round(canvas.clientWidth / 8);
    for(let i=0;i<count;i++){
      drops.push({
        x: Math.random()*canvas.clientWidth,
        y: Math.random()*canvas.clientHeight,
        l: 4 + Math.random()*18,
        speed: 0.6 + Math.random()*2.2,
        opacity: 0.06 + Math.random()*0.25
      });
    }
  }

  function draw(){
    if(!canvas || !ctx) return;
    ctx.clearRect(0,0,canvas.clientWidth, canvas.clientHeight);
    for(const d of drops){
      ctx.beginPath();
      ctx.moveTo(d.x, d.y);
      ctx.lineTo(d.x + 1.6, d.y + d.l);
      ctx.strokeStyle = 'rgba(255,255,255,' + d.opacity + ')';
      ctx.lineWidth = 1;
      ctx.stroke();

      d.y += d.speed;
      if(d.y > canvas.clientHeight + 20){
        d.y = -20;
        d.x = Math.random()*canvas.clientWidth;
      }
    }
  }

  function loop(){
    draw();
    raf = requestAnimationFrame(loop);
  }

  function destroy(){
    cancelAnimationFrame(raf);
    window.removeEventListener('resize', resize);
  }

  window.__Rain = { init, destroy };

})(window, window.__Utils);
