// ======================= EVENTOS ===================================

// Eventos Botones Ventas
document.addEventListener("DOMContentLoaded", function () {

    // Evento Ver Historial Ventas
    document.getElementById('btnHistorial').
        addEventListener('click', (event) => {
            event.preventDefault()
            
            // Alerta Confirmar Visualizacion
            Swal.fire({
                title: '¿Estas Seguro?',
                text: 'Serás redirigido al historial de ventas.',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Sí, Ir',
                cancelButtonText: 'Cancelar',
            }).then((result) => {
                if (result.isConfirmed) {
                    Swal.fire({
                        position: 'center',
                        icon: 'error',
                        title: '¡Error Visualizacion!',
                        text: 'No se puede acceder al historial, no está habilitado.',
                        showConfirmButton: false,
                        timer: 2000
                    })
                }
            });
        })


    // Evento Ver Estadisticas Ventas
    document.getElementById('btnEstadisticas').
    addEventListener('click', (event) => {
        event.preventDefault()
        
        // Alerta Confirmar Visualizacion
        Swal.fire({
            title: '¿Estas Seguro?',
            text: 'Serás redirigido a las estadisticas de los empleados',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, Ir',
            cancelButtonText: 'Cancelar',
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    position: 'center',
                    icon: 'error',
                    title: '¡Error Visualizacion!',
                    text: 'No se puede ver las Estadisticas, No esta habilitado',
                    showConfirmButton: false,
                    timer: 2000
                })
            }
        });
    })



})
