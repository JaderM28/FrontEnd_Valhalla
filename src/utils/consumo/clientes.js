import * as valid from '../validations/expresiones.mjs';
import * as alert from '../validations/alertas.mjs';

// Se crea la constante con la Url del API
const url = 'https://backend-valhalla.onrender.com/ruta/clientes';

// ======================= LISTAR ===================================

// Funcion Listar Datos Clientes
const listarClientes = async () => {
    const tabla = $('#dataTable').DataTable({

        "bProcessing": true, // Habilita la pantalla de carga
        "serverSide": false, // Puedes cambiar esto según tus necesidades

        "columns": [
            { "data": "index" }, // Índice autoincremental
            { "data": "numeroDocumento" },
            { "data": "nombres" },
            { "data": "apellidos" },
            { "data": "genero" }, // Fecha de registro
            { "data": "telefono" },
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
        const listaClientes = data.clientes;
        console.log(listaClientes)
        // Agregar un índice autoincremental y fecha de registro a los datos
        listaClientes.forEach((cliente, index) => {
            cliente.index = index + 1;
            cliente.botones_accion = `
                <div class=" d-flex justify-content-around">
                    <a href="" class="btn btn-primary" id="btnUpdate" data-index="${cliente._id}" data-toggle="modal" data-target="#UpdateModal"><i class="fas fa-edit" ></i></a>
                    <a href="" class="btn btn-danger" id="btnDelete" data-index="${cliente._id}" ><i class="fas fa-trash-alt"></i></a>
                    <a href="" class="btn btn-warning" id="btnVer" data-index="${cliente._id}" data-toggle="modal" data-target="#ShowModal" ><i class="fas fa-eye"></i></a>
                </div>
            `;
        });

        tabla.clear().draw();
        tabla.rows.add(listaClientes).draw(); 

        // Evento Borrar Datos Cliente
        tabla.on('click', '#btnDelete', function (event) {
            event.preventDefault()
            const button = this
            const clieID = button.getAttribute('data-index');
            eliminarClientes(clieID)
        })

        // Evento Modificar Datos Modal
        tabla.on('click', '#btnUpdate', function () {
            const button = this
            const clieID = button.getAttribute('data-index');
            document.getElementById('formModificar').reset()
            verClientes(clieID)
        })
    })
    .catch(function (error) {
        console.error('Error:', error);
    });
}

// ======================= LISTAR MODAL ===================================

// Funcion Ver Clientes
const verClientes = async (cliente) => {

    await fetch(`https://backend-valhalla.onrender.com/ruta/clientes/${cliente}`, {
        method: 'GET',
        mode: 'cors',
        headers: { "Content-type": "application/json; charset=UTF-8" }
    })
    .then((resp) => resp.json())
    .then((data) => {
        const cliente = data.clienteID; 
        console.log(cliente)
        document.getElementById('txtID').value = cliente._id
        document.getElementById('txtNombres').value = cliente.nombres
        document.getElementById('txtApellidos').value = cliente.apellidos
        document.getElementById('txtTelefono').value = cliente.telefono
        document.getElementById('selDocumento').value = cliente.tipoDocumento
        document.getElementById('txtNumDocumento').value = cliente.numeroDocumento
        document.getElementById('txtGenero').value = cliente.genero
        document.getElementById('txtDireccion').value = cliente.direccion
    })
    .catch((error) => {
        console.log('Error: ', error);
    });
}

// ======================= MODIFICAR ===================================

// Funcion Modificar Clientes
const modificarClientes = async () => {

    const campos = [
        { 
            id: 'txtNombres', 
            label: 'Nombres', 
            msg: 'el campo debe contener solo letras o caracteres.',
            validacion: valid.validarNombre 
        },
        { 
            id: 'txtApellidos',
            label: 'Apellidos',
            msg: 'el campo debe contener solo letras o caracteres.',
            validacion: valid.validarApellido 
        },
        { 
            id: 'txtTelefono', 
            label: 'Telefono', 
            msg: 'el campo debe contener al menos 10 numeros.',
            validacion: valid.validarTelefono
        },
        { 
            id: 'selDocumento',
            label: 'Tipo Documento'
        },
        { 
            id: 'txtNumDocumento', 
            label: 'Numero Documento', 
            msg: 'el campo debe contener al menos 10 numeros.',
            validacion: valid.validarDocumento
        },
        { 
            id: 'txtGenero', 
            label: 'Genero', 
            msg: 'el campo debe contener solo letras.',
            validacion: valid.validarGenero
        },
        { 
            id: 'txtDireccion', 
            label: 'Direccion', 
            msg: 'el campo debe contener solo letras o caracteres.',
            validacion: valid.validarDireccion
        }
    ];

    if (!alert.validarCampos(campos)) {
        return;
    }else{
        
        const cliente = {
            _id: document.getElementById('txtID').value,
            nombres: document.getElementById('txtNombres').value,
            apellidos: document.getElementById('txtApellidos').value,
            telefono: document.getElementById('txtTelefono').value, 
            tipoDocumento: document.getElementById('selDocumento').value, 
            numeroDocumento: document.getElementById('txtNumDocumento').value, 
            genero: document.getElementById('txtGenero').value, 
            direccion: document.getElementById('txtDireccion').value
        };

        fetch(url, {
            method: 'PUT',
            mode: 'cors',
            body: JSON.stringify(cliente),
            headers: { 'Content-type': 'application/json; charset=UTF-8' },
        })
        .then((resp) => resp.json())
        .then((json) => {
            if (json.msg) {

                Swal.fire({
                    position: 'center',
                    icon: 'success',
                    title: '¡Modificación Exitosa!',
                    text: json.msg,
                    showConfirmButton: false,
                    timer: 1500
                })
                setTimeout(() => {
                    window.location.href = '/listarClientes';
                }, 2000);
            }
        })
        .catch((error) => {
            
            console.error('Error al Registrar Cliente:', error);
            Swal.fire({
                position: 'center',
                icon: 'error',
                title: '¡Error al Registrar Cliente!',
                text: 'No se pudo procesar la solicitud, Inténtelo nuevamente.',
                showConfirmButton: false,
                timer: 1500
            })
            window.location.reload();
        });
    }

}

// ======================= ELIMINAR ===================================

// Funcion Eliminar Datos Cliente
const eliminarClientes = (id) => {
    
    Swal.fire({
        title: '¿Está seguro de realizar la eliminación?',
        text: 'Esta acción no se puede deshacer.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar',
    }).then((result) => {
        if (result.isConfirmed) {
            let usuario = {
                _id: id,
            };
            fetch(url, {
                method: 'DELETE',
                mode: 'cors',
                body: JSON.stringify(usuario),
                headers: { 'Content-type': 'application/json; charset=UTF-8' },
            })
            .then((resp) => resp.json())
            .then((json) => {
                Swal.fire({
                position: 'center',
                icon: 'success',
                title: '¡Cliente Eliminado Exitosamente!',
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
                    title: '¡Cliente Eliminado Exitosamente!',
                    text: 'Se produjo un error al eliminar el Cliente',
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

// ========= EVENTOS ===============================

// Eventos Botones CLientes

document.addEventListener("DOMContentLoaded", function () {

    const PageUrl = window.location.href;

    // Comprueba la URL listar Clientes
    if (PageUrl.includes("/listarClientes")) {
        listarClientes();

        //Evento Resetear Formulario
        document.getElementById('btnMdReset').
        addEventListener('click', () => {
            document.getElementById('formModificar').reset()
        })

        //Evento Confirmar Modificacion Datos 
        document.getElementById('btnMdGuardar').
        addEventListener('click', () => {
            modificarClientes()
        })

        //Evento Generar Reporte Datos Cliente
        document.getElementById('btnGenerar').
        addEventListener('click', (event) => {
            event.preventDefault()
            
            Swal.fire({
                title: '¿Estas Seguro?',
                text: 'Se generar un reporte de los usuarios en PDF',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Sí, Generar',
                cancelButtonText: 'Cancelar',
            }).then((result) => {
                if (result.isConfirmed) {
                    Swal.fire({
                        position: 'center',
                        icon: 'error',
                        title: '¡Error Visualizacion!',
                        text: 'No se puede generar reporte, no está habilitado.',
                        showConfirmButton: false,
                        timer: 2000
                    })
                }
            });
        })

        //Evento Generar Reporte Datos Cliente
        document.getElementById('btnExcel').
        addEventListener('click', (event) => {
            event.preventDefault()
            
            Swal.fire({
                title: '¿Estas Seguro?',
                text: 'Se generar un reporte de los usuarios en Excel',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Sí, Generar',
                cancelButtonText: 'Cancelar',
            }).then((result) => {
                if (result.isConfirmed) {
                    Swal.fire({
                        position: 'center',
                        icon: 'error',
                        title: '¡Error Visualizacion!',
                        text: 'No se puede generar reporte, no está habilitado.',
                        showConfirmButton: false,
                        timer: 2000
                    })
                }
            });
        })
    }
});








