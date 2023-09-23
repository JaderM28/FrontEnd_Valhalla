// Evento Guardar Reserva
document.querySelector('.save-event').addEventListener('click', function () {
  // Muestra un SweetAlert de éxito
  Swal.fire({
      title: '¡Registro Exitoso!',
      text: 'Evento creado con éxito',
      icon: 'success',
      confirmButtonText: 'OK'
  });
});

// Evento Eliminar Reserva
document.querySelector('.delete-event').addEventListener('click', function () {
  // Muestra un SweetAlert de éxito
  Swal.fire({
      title: '¡Eliminacion Exitosa!',
      text: 'Evento eliminado con éxito',
      icon: 'success',
      confirmButtonText: 'OK'
  });
});

// Evento Guardar Cambios Reserva
document.querySelector('.save-event').addEventListener('click', function () {
  // Muestra un SweetAlert de éxito
  Swal.fire({
      title: '¡Modificado con Exito!',
      text: 'Evento Modificado con éxito',
      icon: 'success',
      confirmButtonText: 'OK'
  });
});