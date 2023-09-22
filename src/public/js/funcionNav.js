document.addEventListener("DOMContentLoaded", function() {
    
    const currentUrl = window.location.pathname; // Obtiene la URL actual
    const navItems = document.querySelectorAll('li.nav-item'); // Selecciona todos los elementos de navegación

    navItems.forEach(function(navItem) {
        const navLink = navItem.querySelector('a.nav-link'); // Busca el enlace dentro de cada elemento de navegación
        if (navLink) {
            const linkUrl = navLink.getAttribute('href'); // Obtiene la URL del enlace

            if (currentUrl === linkUrl) {
                navItem.classList.add('active'); // Agrega la clase 'active' al elemento actual
            }
        }
    });

    
});