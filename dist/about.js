const menu = document.querySelector('.menu');
const nav = document.querySelector('#navigation');
menu.hidden = false;
function closeMenu(){menu.setAttribute('aria-expanded','false');nav.classList.remove('open');}
menu.addEventListener('click',()=>{const open=nav.classList.toggle('open');menu.setAttribute('aria-expanded',String(open));});
nav.addEventListener('click',event=>{if(event.target.closest('a'))closeMenu();});
document.addEventListener('keydown',event=>{if(event.key==='Escape'){closeMenu();nav.querySelectorAll('details').forEach(item=>item.open=false);}});
// The hero stays fixed beneath the navigation so the portrait remains visible.
const serviceMenu = nav.querySelector('.dropdown');
const desktopMenu = matchMedia('(min-width: 851px)');
serviceMenu.addEventListener('pointerenter', event => {if(desktopMenu.matches && event.pointerType==='mouse')serviceMenu.open=true;});
serviceMenu.addEventListener('pointerleave', event => {if(desktopMenu.matches && event.pointerType==='mouse')serviceMenu.open=false;});
serviceMenu.querySelector('summary').addEventListener('click', event => {if(desktopMenu.matches && event.detail > 0 && serviceMenu.open)event.preventDefault();});
