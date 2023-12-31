import * as valid from '../validations/expresiones.mjs';
import * as alert from '../validations/alertas.mjs';

// Se crea la constante con la Url del Api
const url = 'https://backend-valhalla.onrender.com/ruta/servicios';

// ======================= LISTAR ===================================

// Funcion listar Servicios
const listarServicios = async () => {
    const tabla = $('#dataTable').DataTable({

        "bProcessing": true, // Habilita la pantalla de carga
        "serverSide": false, // Puedes cambiar esto segun tus necesidades

        "columns": [
            { "data": "index" }, // Indice autoincremental
            { "data": "nombre" },
            { "data": "duracion" },
            { "data": "precio" },
            { "data": "categoria" },
            { "data": "estado" },
            { "data": "botones_accion"}
        ],
    });

    // Hacer la solicitud a la API
    await fetch(url, {
        method: 'GET',
        mode: 'cors',
        headers: { "Content-type": "application/json; charset=UTF-8" }
    })
    .then((resp) => resp.json())
    .then(function (data) {
        const listaServicios = data.servicio;
        console.log(listaServicios)
        // Agregar un índice autoincremental y fecha de registro a los datos
        listaServicios.forEach((servicio, index) => {
            servicio.index = index + 1;
            if (servicio.estado) {
                servicio.estado =`<i class="fas fa-toggle-on fa-2x text-success" id="cambiar-estado" data-index="${servicio._id}" data-estado="${servicio.estado}"></i>`;
            } else {
                servicio.estado =`<i class="fas fa-toggle-on fa-rotate-180 fa-2x text-danger" id="cambiar-estado" data-index="${servicio._id}" data-estado="${servicio.estado}"></i>`;
            }   
            // Se insertan los botones de acciones  
            servicio.botones_accion = `
                <div class="text-center d-flex justify-content-around">
                    <a href="#" class="btn btn-primary" id="btnUpdate" data-index="${servicio._id}" data-toggle="modal" data-target="#UpdateModal"><i class="fas fa-edit"></i></a>
                    <a href="#" class="btn btn-danger" id="btnDelete" data-index="${servicio._id}"><i class="fas fa-trash-alt"></i></a>
                    <a href="#" class="btn btn-warning" id="btnVer" data-index="${servicio._id}" data-toggle="modal" data-target="#ShowModal"><i class="fas fa-eye"></i></a>
                </div>
            `;
        });

        // Se Listan las Filas Servicios
        tabla.clear().draw();
        tabla.rows.add(listaServicios).draw(); 

        // Cambiar de estado
        tabla.on('click', '#cambiar-estado', function () {              
            const userId = this.getAttribute('data-index');
            let currentEstado = this.getAttribute('data-estado'); // Obtiene el atributo como cadena
        
            // Compara la cadena con "true"
            if (currentEstado === "true") {
                this.classList.remove('text-success');
                this.classList.add('fa-rotate-180', 'text-danger');
                currentEstado = "false"; // Establece la cadena "false"
            } else {
                this.classList.remove('fa-rotate-180', 'text-danger');
                this.classList.add('text-success');
                currentEstado = "true"; // Establece la cadena "true"
            }

            this.setAttribute('data-estado', currentEstado); // Actualiza el atributo data-estado
            cambiarEstado(userId, currentEstado);
        })

        // Evento Borrar Datos Usuarios
        tabla.on('click', '#btnDelete', function () {
            const button = this
            const servID = button.getAttribute('data-index');
            eliminarServicios(servID)
        })

         // Evento Modificar Datos Usuarios
        tabla.on('click', '#btnUpdate', function () {
            const button = this
            const servID = button.getAttribute('data-index');
            document.getElementById('formModificar').reset()
            verServicios(servID)
        })

    })
    .catch(function (error) {
        console.error('Error:', error);
    });
}

// ======================= CAMBIAR DATOS ===================================

// Funcion Cambiar Estado Servicios
function cambiarEstado(userId, newEstado) {

    const servicios = {
        _id: userId,
        estado:newEstado,
    };

    fetch(url, {
        method: 'PUT',
        mode: 'cors',
        body: JSON.stringify(servicios),
        headers: { 'Content-type': 'application/json; charset=UTF-8' },
    })
    .catch((error) => {
        console.error('Error:', error);
        Swal.fire('Error', 'Se produjo un error al cambiar estado servicios', 'error');
    });
} 

// ======================= LISTAR MODAL ===================================

// Funcion Ver Servicios
const verServicios = async (servicio) => {

    await fetch(url+`/${servicio}`, {
        method: 'GET',
        mode: 'cors',
        headers: { "Content-type": "application/json; charset=UTF-8" }
    })
    .then((resp) => resp.json())
    .then((data) => {
        const servicios = data.servicioID; 
        console.log(servicios)
        document.getElementById('txtID').value = servicios._id
        document.getElementById('txtNombre').value = servicios.nombre
        document.getElementById('txtDuracion').value = servicios.duracion
        document.getElementById('txtPrecio').value = servicios.precio
        document.getElementById('selCategoria').value = servicios.categoria
        document.getElementById('txtDescripcion').value = servicios.descripcion
    })
    .catch((error) => {
        console.log('Error: ', error);
    });
}

// ======================= CREAR ===================================

// Funcion Crear Servicios
const crearServicios = async () => {

    const campos = [
        { 
            id: 'txtNombre', 
            label: 'Nombres',
            msg: 'el campo debe contener solo letras o caracteres.', 
            validacion: valid.validarNombre
        },
        { 
            id: 'txtDuracion', 
            label: 'Duracion',
            msg: 'el campo debe contener un formato valido de tiempo ejemplo(1:00 o 22:00).', 
            validacion: valid.validarDuracion
        },
        { 
            id: 'txtPrecio', 
            label: 'Precio',
            msg: 'el campo debe contener solo numeros, punto y decimales', 
            validacion: valid.validarPrecio
        },
        { 
            id: 'selCategoria', 
            label: 'Categoria'},
        { 
            id: 'txtDescripcion', 
            label: 'Descripcion',
            msg: 'el campo debe contener solo letras o caracteres.', 
            validacion: valid.validarTextArea
        }
    ];

    // Comprueba las validaciones de los campos
    if (!alert.validarCampos(campos)) {
        return;
    }else{
        
        const servicios = {
            nombre: document.getElementById('txtNombre').value,
            duracion: document.getElementById('txtDuracion').value,
            precio: document.getElementById('txtPrecio').value, 
            categoria: document.getElementById('selCategoria').value, 
            descripcion: document.getElementById('txtDescripcion').value, 
        };

        fetch(url, {
            method: 'POST',
            mode: 'cors',
            body: JSON.stringify(servicios),
            headers: { 'Content-type': 'application/json; charset=UTF-8' },
        })
        .then((resp) => resp.json())
        .then((json) => {
            if (json.msg) {

                Swal.fire({
                    position: 'center',
                    icon: 'success',
                    title: '¡Registro Exitoso!',
                    text: json.msg,
                    showConfirmButton: false,
                    timer: 1500
                })
                setTimeout(() => {
                    window.location.href = '/listarServicios';
                }, 2000);
            }
        })
        .catch((error) => {
            
            console.error('Error al registrar el servicio:', error);
            Swal.fire({
                position: 'center',
                icon: 'error',
                title: '¡Error al Registrar el Servicio!',
                text: 'No se pudo procesar la solicitud, Inténtelo nuevamente.',
                showConfirmButton: false,
                timer: 1500
            })
            window.location.reload();
        });
    }
}

// ======================= MODIFICAR ===================================

// Funcion Modificar Servicios
const modificarServicios = async () => {

    const campos = [
        {
            id: 'txtNombre', 
            label: 'Nombres', 
            msg: 'el campo debe contener solo letras o caracteres.',
            validacion: valid.validarNombre 
        },
        { 
            id: 'txtDuracion', 
            label: 'Duracion',
            msg: 'el campo debe contener un formato valido de tiempo (1:00 o 22:00).',  
            validacion: valid.validarDuracion
        },
        { 
            id: 'txtPrecio',
            label: 'Precio',
            msg: 'el campo debe contener solo numeros.',  
            validacion: valid.validarPrecio
        },
        { 
            id: 'selCategoria', 
            label: 'Categoria'
        },
        { 
            id: 'txtDescripcion', 
            label: 'Descripcion',
            msg: 'el campo debe contener solo letras o caracteres.', 
            validacion: valid.validarTextArea
    }
    ];

    // Comprueba las validaciones de los campos
    if (!alert.validarCampos(campos)) {
        return;
    }else{
        
        const servicio = {
            _id: document.getElementById('txtID').value,
            nombre: document.getElementById('txtNombre').value,
            duracion: document.getElementById('txtDuracion').value,
            precio: document.getElementById('txtPrecio').value, 
            categoria: document.getElementById('selCategoria').value, 
            descripcion: document.getElementById('txtDescripcion').value, 
        };

        fetch(url, {
            method: 'PUT',
            mode: 'cors',
            body: JSON.stringify(servicio),
            headers: { 'Content-type': 'application/json; charset=UTF-8' },
        })
        .then((resp) => resp.json())
        .then((json) => {
            if (json.msg) {

                Swal.fire({
                    position: 'center',
                    icon: 'success',
                    title: '¡Modificacion Exitosa!',
                    text: json.msg,
                    showConfirmButton: false,
                    timer: 1500
                })
                setTimeout(() => {
                    window.location.href = '/listarServicios';
                }, 2000);
            }
        })
        .catch((error) => {
            
            console.error('Error al registrar el servicio:', error);
            Swal.fire({
                position: 'center',
                icon: 'error',
                title: '¡Error al Registrar el Servicio!',
                text: 'No se pudo procesar la solicitud, Inténtelo nuevamente.',
                showConfirmButton: false,
                timer: 1500
            })
            window.location.reload();
        });
    }
}

// ======================= MODIFICAR ===================================

// Funcion Eliminar Servicios
const eliminarServicios = (id) => {

    Swal.fire({
        title: '¿Está seguro de realizar la eliminación?',
        text: 'Esta acción no se puede deshacer.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar',
    }).then((result) => {
        if (result.isConfirmed) {
            let servicio = {
                _id: id,
            };
            fetch(url, {
                method: 'DELETE',
                mode: 'cors',
                body: JSON.stringify(servicio),
                headers: { 'Content-type': 'application/json; charset=UTF-8' },
            })
            .then((resp) => resp.json())
            .then((json) => {
                Swal.fire({
                position: 'center',
                icon: 'success',
                title: '¡Servicio Eliminado Exitosamente!',
                text: json.msg,
                showConfirmButton: false,
                timer: 1500
            })
            setTimeout(() => {
                    window.location.reload();
                }, 2000);
                
            })
            .catch((error) => {
                console.error('Error:', error);
                Swal.fire({
                    position: 'center',
                    icon: 'error',
                    title: '¡Servicio Eliminado Exitosamente!',
                    text: 'Se produjo un error al eliminar el Servicio',
                    showConfirmButton: false,
                    timer: 1500
                })
                setTimeout(() => {
                    window.location.reload();
                }, 2000);
                
            });
        }
    });
};



// ======================= EVENTOS ===================================

// Eventos Botones Servicios
document.addEventListener("DOMContentLoaded", function () {

    const PageUrl = window.location.href;

    // Comprueba la URL listar Servicios
    if (PageUrl.includes("/listarServicios")) {
        listarServicios();

        // Evento Resetear Formulario
        document.getElementById('btnMdReset').
        addEventListener('click', () => {
            document.getElementById('formModificar').reset()
        })

        // Evento Confimrar Modificacion Datos 
        document.getElementById('btnMdGuardar').
        addEventListener('click', () => {
            modificarServicios()
        })
    }

    // Comprueba la URL Crear Servicios
    if(PageUrl.includes("/crearServicios")){

        // Evento Guardar Datos Servicios
        document.getElementById('btnGuardar').
        addEventListener('click', () => {
            crearServicios();
        })

        // Evento Resetear Datos Formulario
        document.getElementById('btnReset').
        addEventListener('click', (event) => {
            event.preventDefault()
            document.getElementById('formModificar').reset()
        })

        // Evento Salir del Formulario
        document.getElementById('btnCancelar').
        addEventListener('click', (event) => {
            event.preventDefault()
            
            Swal.fire({
                title: '¿Estas Seguro?',
                text: 'No se registrara ningun Servicio',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Sí, Salir',
                cancelButtonText: 'Cancelar',
            }).then((result) => {
                if (result.isConfirmed) {
                    setTimeout(() => {
                        window.location.href = '/listarServicios';
                    }, 1800);
                }
            });
        })
    }
});