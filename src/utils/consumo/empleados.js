import * as valid from '../validations/expresiones.mjs';
import * as alert from '../validations/alertas.mjs';

// Se crea la constante con la Url del API
const url = 'https://backend-valhalla.onrender.com/ruta/empleados';

// ======================= LISTAR ===================================

// Funcion Listar Empleados 
const listarEmpleados = async () => {
    const tabla = $('#dataTable').DataTable({

        "bProcessing": true, // Habilita la pantalla de carga
        "serverSide": false, 

        // Se determinan las columnas que se van a insertar en  la tabla 
        "columns": [
            { "data": "index" },
            { "data": "numeroDocumento" },
            { "data": "nombres" },
            { "data": "apellidos" },
            { "data": "telefono" }, 
            { "data": "genero" },
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
            const listaEmpleados = data.empleados;

            // Agregar un índice autoincremental y fecha de registro a los datos
            listaEmpleados.forEach((empleado, index) => {
                empleado.index = index + 1;
                empleado.botones_accion = `
                <div class=" d-flex justify-content-around">
                    <a href="" class="btn btn-primary" id="btnUpdate" data-index="${empleado._id}" data-toggle="modal" data-target="#UpdateModal"><i class="fas fa-edit" ></i></a>
                    <a href="" class="btn btn-danger" id="btnDelete" data-index="${empleado._id}"><i class="fas fa-trash-alt"></i></a>
                    <a href="" class="btn btn-warning" id="btnVer" data-index="${empleado._id}" data-toggle="modal" data-target="#ShowModal"><i class="fas fa-eye"></i></a>
                    <a href="" class="btn btn-info" id="btnServicios" data-index="${empleado._id}" data-toggle="modal" data-target="#ServicesModal"><i class="fas fa-cut"></i></a>
                </div>
                `;
            });

            tabla.clear().draw();
            tabla.rows.add(listaEmpleados).draw(); 

            // Evento Borrar Datos Empleados
            tabla.on('click', '#btnDelete', function (event){
                event.preventDefault()
                const button = this
                const empleID = button.getAttribute('data-index');
                eliminarEmpleados(empleID)
            })

            // Evento Ver Servicios Datos Empleados
            tabla.on('click', '#btnServicios', function () {
                const button = this
                const empleID = button.getAttribute('data-index');
                document.getElementById('formModificar').reset()
                verServicios(empleID)
            })

            // Evento Modificar Datos Empleados
            tabla.on('click', '#btnUpdate', function () {
                const button = this
                const empleID = button.getAttribute('data-index');
                document.getElementById('formModificar').reset()
                verModal(empleID)
            })

            // Evento Ver Datos Empleados
            tabla.on('click', '#btnVer', function () {
                const button = this
                const empleID = button.getAttribute('data-index');
                document.getElementById('formModificar').reset()
                verEmpleados(empleID)
            })
            
        })
        .catch(function (error) {
            console.error('Error:', error);
        });
}

// ======================= LISTAR MODAL SERVICIOS ===================================

// Funcion Ver Datos Servicios Modal
const verServicios = async (empleado) => {

    await fetch(url+`/${empleado}`, {
        method: 'GET',
        mode: 'cors',
        headers: { "Content-type": "application/json; charset=UTF-8" }
    })
    .then((resp) => resp.json())
    .then((data) => {
        const empleado = data.empleadoID; 
        /* document.getElementById('txtID').value = empleado._id */
        document.getElementById('txtSerNombres').value = empleado.nombres +' '+ empleado.apellidos
        
    })
    .catch((error) => {
        console.log('Error: ', error);
    });
  
}

// ======================= LISTAR MODAL ===================================

// Funcion Ver Datos Empleados Modal
const verModal = async (empleado) => {

    await fetch(url+`/${empleado}`, {
        method: 'GET',
        mode: 'cors',
        headers: { "Content-type": "application/json; charset=UTF-8" }
    })
    .then((resp) => resp.json())
    .then((data) => {
        const empleado = data.empleadoID; 
        document.getElementById('txtID').value = empleado._id
        document.getElementById('txtNombres').value = empleado.nombres
        document.getElementById('txtApellidos').value = empleado.apellidos
        document.getElementById('txtTelefono').value = empleado.telefono
        document.getElementById('selDocumento').value = empleado.tipoDocumento
        document.getElementById('txtNumDocumento').value = empleado.numeroDocumento
        document.getElementById('txtGenero').value = empleado.genero
        document.getElementById('txtDireccion').value = empleado.direccion
    })
    .catch((error) => {
        console.log('Error: ', error);
    });
}


// ======================= LISTAR DATOS EMPLEADOS ===================================

// Funcion Ver Datos Empleados Modal
const verEmpleados = async (idEmpleado) => {

    await fetch(url+`/${idEmpleado}`, {
        method: 'GET',
        mode: 'cors',
        headers: {'Content-type': "aplication/json; charset=UTF-8"}
    })
    .then((resp) => resp.json())
    .then((data) => {
        const empleado = data.empleadoID;
        console.log(empleado)
        const fechaFormateada = empleado.fechaNacimiento.split('T')[0];
        
        /* document.getElementById('txtVerID').textContent = empleado._id */
        document.getElementById('txtVerTipoDocumento').textContent = empleado.tipoDocumento
        document.getElementById('txtVerNombres').textContent = empleado.nombres
        document.getElementById('txtVerApellidos').textContent = empleado.apellidos
        document.getElementById('txtVerTelefono').textContent = empleado.telefono
        document.getElementById('txtVerNumDocumento').textContent = empleado.numeroDocumento
        document.getElementById('txtVerFechaNacimiento').textContent = fechaFormateada
        document.getElementById('txtVerGenero').textContent = empleado.genero
        document.getElementById('txtVerDireccion').textContent = empleado.direccion

    })
    .catch((error) => {
        console.log('Error: ',error)
    })
}

// ======================= MODIFICAR ===================================

// Funcion Modificar Empleados
const modificarEmpleados = async () => {

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
        
        const Empleado = {
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
            body: JSON.stringify(Empleado),
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
                    window.location.href = '/listarEmpleados';
                }, 2000);
            }
        })
        .catch((error) => {
            
            console.error('Error al registrar Empleado:', error);
            Swal.fire({
                position: 'center',
                icon: 'error',
                title: '¡Error al Registrar Empleado!',
                text: 'No se pudo procesar la solicitud, Inténtelo nuevamente.',
                showConfirmButton: false,
                timer: 1500
            })
            window.location.reload();
        });
    }
}

// ======================= ELIMINAR ===================================

// Funcion Eliminar Empleados
const eliminarEmpleados = (id) => {
        
    Swal.fire({
        title: '¿Está seguro de realizar la eliminación?',
        text: 'Esta acción no se puede deshacer.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar',
    }).then((result) => {
        if (result.isConfirmed) {
            let empleado = {
                _id: id,
            };
            fetch(url, {
                method: 'DELETE',
                mode: 'cors',
                body: JSON.stringify(empleado),
                headers: { 'Content-type': 'application/json; charset=UTF-8' },
            })
            .then((resp) => resp.json())
            .then((json) => {
                Swal.fire({
                position: 'center',
                icon: 'success',
                title: '¡Empleado Eliminado Exitosamente!',
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
                    title: '¡Empleado Eliminado Exitosamente!',
                    text: 'Se produjo un error al eliminar el Empleado',
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

// Eventos Botones Empleados

document.addEventListener("DOMContentLoaded", function () {

    const PageUrl = window.location.href;

    // Verificar si la URL contiene "listarusuarios"
    if (PageUrl.includes("/listarEmpleados")) {
        listarEmpleados();

        document.getElementById('btnMdReset').
        addEventListener('click', () => {
            document.getElementById('formModificar').reset()
        })

        document.getElementById('btnMdGuardar').
        addEventListener('click', () => {
            modificarEmpleados()
        })

        document.getElementById('btnAsignar').
        addEventListener('click', () => {
            Swal.fire({
                position: 'center',
                icon: 'success',
                title: '¡Asignacion Exitosa!',
                text: 'Los servicios fueron asociados correctamente',
                showConfirmButton: false,
                timer: 2000
            })
            setTimeout(() => {
                window.location.reload();
            }, 2500);
        })

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






