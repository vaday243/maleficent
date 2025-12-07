// hero.js - small entrance animation
document.addEventListener('DOMContentLoaded', () => {
  const root = document.querySelector('.hero-inner');
  if(!root) return;
  root.style.opacity = 0;
  root.style.transform = 'translateY(10px)';
  setTimeout(()=> {
    root.style.transition = 'opacity 600ms ease, transform 600ms ease';
    root.style.opacity = 1;
    root.style.transform = 'translateY(0)';
  }, 80);
});
