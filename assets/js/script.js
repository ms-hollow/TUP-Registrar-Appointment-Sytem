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

            let h1 = document.querySelector('.main-view .container h1');
            if (h1) {
                h1.classList.toggle('hide-h1', sideBar.classList.contains('active'));
            }
        });
    } else {
        console.error("Element with ID 'menu-btn' not found.");
    }



});