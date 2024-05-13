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

    let footer = document.querySelector('.footer');
    
        function toggleFooterVisibility() {
          // Check if the user has scrolled to the bottom
          if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
            footer.style.visibility = 'visible';
          } else {
            footer.style.visibility = 'hidden';
          }
        }
    
        // Initial check
        toggleFooterVisibility();
    
        // Listen for scroll events
        window.addEventListener('scroll', toggleFooterVisibility);


});

