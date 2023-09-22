document.addEventListener("DOMContentLoaded", function() {
    var currentUrl = window.location.pathname; // Obtiene la URL actual
    var navItems = document.querySelectorAll('li.nav-item'); // Selecciona todos los elementos de navegación

    navItems.forEach(function(navItem) {
        var navLink = navItem.querySelector('a.nav-link'); // Busca el enlace dentro de cada elemento de navegación
        if (navLink) {
            var linkUrl = navLink.getAttribute('href'); // Obtiene la URL del enlace

            if (currentUrl === linkUrl) {
                navItem.classList.add('active'); // Agrega la clase 'active' al elemento actual
            }
        }
    });

    
});