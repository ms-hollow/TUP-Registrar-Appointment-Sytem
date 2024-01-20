let menu = document.querySelector('#menu-icon');
let nav_bar = document.querySelector('.nav_bar');

menu.onclick = () => {
    menu.classList.toggle('bx-x');
    nav_bar.classList.toggle('open');
}