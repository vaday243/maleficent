/* carScene.js
   Creates the car-on-path motion using GSAP MotionPathPlugin,
   and controls chat bubble pop-ins and polaroid hover behavior.
*/

(function(window, Utils){
  const carContainer = Utils.$('#carStage');
  const polaroidsContainer = Utils.$('#polaroids');
  const bubbles = [
    {id: 'bubble1', delay: 0.9},
    {id: 'bubble2', delay: 2.4},
    {id: 'bubble3', delay: 3.7},
    {id: 'bubble4', delay: 4.1}
  ];

  function createSvgPath(){
    // If the HTML already contains an SVG path (from index.html), don't recreate.
    // Otherwise, inject a simple SVG with a path and car group.
    if(!carContainer) return null;
    const existing = carContainer.querySelector('svg');
    if(existing) return existing;

    const svgNS = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(svgNS,'svg');
    svg.setAttribute('viewBox','0 0 1000 240');
    svg.setAttribute('preserveAspectRatio','xMinYMid meet');
    svg.setAttribute('width','100%');
    svg.setAttribute('height','100%');

    // path
    const path = document.createElementNS(svgNS,'path');
    path.setAttribute('d','M40,180 C170,130 300,150 430,130 C560,110 690,140 860,115');
    path.setAttribute('id','roadPath');
    path.setAttribute('fill','none');
    path.setAttribute('stroke','rgba(255,255,255,0.03)');
    path.setAttribute('stroke-width','6');
    path.setAttribute('stroke-linecap','round');
    svg.appendChild(path);

    // car group
    const g = document.createElementNS(svgNS,'g');
    g.setAttribute('id','carGroup');
    g.setAttribute('transform','translate(0,0)');

    const car = document.createElementNS(svgNS,'g');
    car.setAttribute('id','car');
    car.setAttribute('transform','translate(0,-30)');

    const rect = document.createElementNS(svgNS,'rect');
    rect.setAttribute('x','-18'); rect.setAttribute('y','0'); rect.setAttribute('width','54'); rect.setAttribute('height','20');
    rect.setAttribute('rx','5'); rect.setAttribute('fill','#fff');

    const c1 = document.createElementNS(svgNS,'circle'); c1.setAttribute('cx','-6'); c1.setAttribute('cy','20'); c1.setAttribute('r','5'); c1.setAttribute('fill','#111');
    const c2 = document.createElementNS(svgNS,'circle'); c2.setAttribute('cx','22'); c2.setAttribute('cy','20'); c2.setAttribute('r','5'); c2.setAttribute('fill','#111');

    car.appendChild(rect); car.appendChild(c1); car.appendChild(c2);
    g.appendChild(car);
    svg.appendChild(g);

    carContainer.appendChild(svg);
    return svg;
  }

  function initPolaroids(){
    if(!polaroidsContainer) return;
    // If placeholders exist, attach simple hover animation via GSAP if available.
    const items = Utils.$$('.polaroid', polaroidsContainer);
    items.forEach((p,i)=>{
      p.addEventListener('mouseenter', ()=> {
        if(window.gsap && !Utils.prefersReducedMotion()){
          gsap.to(p, {scale:1.06, rotation:(Math.random()*6)-3, duration:0.18});
        } else {
          p.style.transform = 'scale(1.03)';
        }
      });
      p.addEventListener('mouseleave', ()=> {
        if(window.gsap && !Utils.prefersReducedMotion()){
          gsap.to(p, {scale:1, rotation:0, duration:0.18});
        } else {
          p.style.transform = '';
        }
      });

      // click to open image in new tab
      p.addEventListener('click', ()=> {
        const img = p.querySelector('img');
        if(img && img.src) window.open(img.src, '_blank');
      });
    });
  }

  function popBubble(id){
    const el = Utils.$('#' + id);
    if(!el) return;
    el.style.opacity = 1;
    if(window.gsap && !Utils.prefersReducedMotion()){
      gsap.fromTo(el, {scale:0.4, rotation:-8}, {scale:1, rotation:0, duration:0.28, ease:'back.out(2)'});
      gsap.to(el, {opacity:0, delay:2.4, duration:0.6});
    } else {
      setTimeout(()=> { el.style.opacity = 0; }, 1600);
    }
  }

  function startCarAnimation(){
    if(Utils.prefersReducedMotion()) return;
    if(!window.gsap || !window.MotionPathPlugin){
      // gracefully degrade: just pop bubbles with timing
      bubbles.forEach(b => setTimeout(()=> popBubble(b.id), b.delay * 1000));
      return;
    }

    // register plugin if not already
    try { gsap.registerPlugin(MotionPathPlugin); } catch(e){ /* already registered */ }

    const svg = createSvgPath();
    if(!svg) return;

    const car = svg.querySelector('#car');
    const path = svg.querySelector('#roadPath');
    if(!car || !path) return;

    gsap.set(car, {x:-18, y:0});

    const tl = gsap.timeline({defaults:{ease:'power1.inOut'}});

    tl.to(car, {
      duration:4.6,
      motionPath: {
        path: path,
        align: path,
        autoRotate: false,
        alignOrigin: [0.5, 0.5]
      },
      onUpdate: function(){ /* could update overlays */ }
    });

    // overshoot and bounce to imply missing the turn
    tl.to(car, {duration:0.35, x:"+=20", y:"+=-6", ease:'power2.out'});
    tl.to(car, {duration:0.35, x:"-=18", y:"+=6", ease:'bounce.out'});

    // schedule bubble pops (timing tuned relative to path duration)
    tl.call(()=> popBubble('bubble1'), [], '-=3.8');
    tl.call(()=> popBubble('bubble2'), [], '-=2.5');
    tl.call(()=> popBubble('bubble3'), [], '-=1.2');
    tl.call(()=> popBubble('bubble4'), [], '>-0.1');
  }

  function init(){
    createSvgPath();        // ensure path exists
    initPolaroids();       // polaroid interactions
    // start animation after a short delay so page load feels smooth
    setTimeout(()=> startCarAnimation(), 400);
  }

  // expose
  window.__CarScene = {
    init
  };

})(window, window.__Utils);
