document.addEventListener('DOMContentLoaded', function () {

    let menu = document.querySelector('#menu-icon');
    let nav_bar = document.querySelector('.nav_bar');

    if (menu && nav_bar) {
        menu.onclick = () => {
            menu.classList.toggle('bx-x');
            nav_bar.classList.toggle('open');
        };
    }

    let sidebarMenuBtn = document.getElementById('menu-btn');
    let sideBar = document.querySelector('.sidebar');

    if (sidebarMenuBtn) {
        sidebarMenuBtn.addEventListener('click', function () {
            sideBar.classList.toggle('active');
            document.body.classList.toggle('sidebar-active');
        });
    } else {
        console.error("Element with ID 'menu-btn' not found.");
    }



});