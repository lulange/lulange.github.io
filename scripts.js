window.addEventListener('DOMContentLoaded', event => {

    // Navbar shrink function
    var navbarShrink = function () {
        const navbarCollapsible = document.body.querySelector('#main-nav');
        if (!navbarCollapsible) {
            return;
        }
        if (window.scrollY === 0) {
            navbarCollapsible.classList.remove('navbar-shrink')
        } else {
            navbarCollapsible.classList.add('navbar-shrink')
        }
    };

    // Shrink the navbar 
    navbarShrink();

    // Shrink the navbar when page is scrolled
    document.addEventListener('scroll', navbarShrink);

    // Collapse responsive navbar when toggler is visible
    const navbarToggler = document.body.querySelector('.navbar-toggler');
    
    // use array.prototype.map on NodeList
    [].map.call(document.querySelectorAll('#navbarResponsive .nav-link'), function (responsiveNavItem) {
        responsiveNavItem.addEventListener('click', () => {
            if (window.getComputedStyle(navbarToggler).display !== 'none') {
                navbarToggler.click();
            }
        });
    });

});

const addScrollSpy = function() {
    // Activate Bootstrap scrollspy on the main nav element
    const mainNav = document.body.querySelector('#main-nav');
    if (mainNav) {
        new bootstrap.ScrollSpy(document.body, {
            target: '#main-nav',
            rootMargin: '0px 0px -40%',
        });
    };
    window.removeEventListener('scroll', addScrollSpy); // probably a bad idea lol but it works beautifully
};
window.addEventListener('scroll', addScrollSpy)
