
import * as valid from '../validations/expresiones.mjs';
import * as alert from '../validations/alertas.mjs';

const url = 'https://backend-valhalla.onrender.com/ruta/usuarios';

const listarUsuarios = async () => {
    const tabla = $('#dataTable').DataTable({

        "bProcessing": true, // Habilita la pantalla de carga
        "serverSide": false, // Puedes cambiar esto según tus necesidades

        "columns": [
            { "data": "index" }, // Índice autoincremental
            { "data": "username" },
            { "data": "correo" },
            { "data": "rol" },
            { "data": "fecha_registro" }, // Fecha de registro
            { "data": "estado" },
            {   // Columna de botones de acción
                "data": "botones_accion",
                
            }
            // Puedes agregar más columnas según tus datos
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
            const listaUsuarios = data.usuarios;

            // Agregar un índice autoincremental y fecha de registro a los datos
            listaUsuarios.forEach((usuario, index) => {
                usuario.index = index + 1;
                usuario.fecha_registro = new Date().toLocaleDateString('en-US', { weekday: "long", year: "numeric", month: "short", day: "numeric" });
                usuario.estado= `<span class="badge badge-success">ACTIVADO</span>`
                usuario.botones_accion = `
                    <div class="text-center d-flex justify-content-around">
                        <a href="#" id="btnUpdate" data_id="${usuario._id}" class="btn btn-primary" data-toggle="modal" data-target="#UpdateModal"><i class="fas fa-edit"></i></a>
                        <a href="#" id="btnDelete" data_id="${usuario._id}" class="btn btn-danger" ><i class="fas fa-trash-alt"></i></a>
                        <a href="#" class="btn btn-warning" data-toggle="modal" data-target="#ShowModal"><i class="fas fa-eye"></i></a>
                    </div>
                `;
            });

            tabla.clear().draw();
            tabla.rows.add(listaUsuarios).draw(); 

            document.addEventListener('DOMContentLoaded', () => {
                // Tu código para agregar event listeners aquí
            });

            document.querySelectorAll('#btnUpdate').forEach((button) => {
                button.addEventListener('click', (event) => {
                    const id = event.target.getAttribute('data_id');
                    console.log(id)
                    if (id) {
                        verUsuarios(id);
                    } else {
                        // Maneja el caso en el que no se proporciona un ID
                        console.error('No se proporcionó un ID para ver el usuario.');
                    }
                });
            });

            document.querySelectorAll('#btnDelete').forEach((button) => {
                button.addEventListener('click', (event)=> {
                    const id = event.target.getAttribute('data-id')
                    console.log(id)
                    eliminarUsuarios(id)
                })
            })
            
            


            

        })
        .catch(function (error) {
            console.error('Error:', error);
        });
}

// ================================================================

const verUsuarios = async (usuario) => {

    await fetch(`https://backend-valhalla.onrender.com/ruta/usuarios/${usuario}`, {
        method: 'GET',
        mode: 'cors',
        headers: { "Content-type": "application/json; charset=UTF-8" }
    })
    .then((resp) => resp.json())
    .then((data) => {
        const usuario = data.usuarioID; 
        console.log(data)
        document.getElementById('txtID').value = usuario._id;
        document.getElementById('txtNombres').value = usuario.nombres;
        document.getElementById('txtApellidos').value = usuario.apellidos;
        document.getElementById('txtUsername').value = usuario.username;
        document.getElementById('txtCorreo').value = usuario.correo;
        document.getElementById('selRol').value = usuario.rol;
    })
    .catch((error) => {
        console.log('Error: ', error);
    });
}

// ==============================================================

const crearUsuarios = async () => {

    const campos = [
        { id: 'txtNombres', label: 'Nombre', validacion: valid.validarNombre },
        { id: 'txtApellidos', label: 'Apellido', validacion: valid.validarApellido },
        { id: 'txtCorreo', label: 'Correo', validacion: valid.validarCorreo },
        { id: 'txtUsername', label: 'Username', validacion: valid.validarUsername},
        /* { id: 'txtTelefono', label: 'Telefono', validacion: valid.validarTelefono}, */
        { id: 'selRol', label: 'Rol'},
        { id: 'txtPassword', label: 'Contraseña', validacion: valid.validarPassword},
        { id: 'txtPasswordRepeat', label: 'Confirmar Contraseña', validacion: valid.validarPassword }
    ];

    if (!alert.validarCampos(campos)) {
        return;
    }

    const txtPassword = document.getElementById('txtPassword').value;
    const txtPasswordRepeat = document.getElementById('txtPasswordRepeat').value;

    if (txtPassword !== txtPasswordRepeat) {

        Swal.fire({
            position: 'center',
            icon: 'error',
            title: '¡Error Registro!',
            text: 'Las Contraseñas ingresadas no coinciden',
            showConfirmButton: false,
            timer: 1500
        })
        return;
    }else{
        
        const usuario = {
            nombres: document.getElementById('txtNombres').value,
            apellidos: document.getElementById('txtApellidos').value,
            username: document.getElementById('txtUsername').value,
            correo: document.getElementById('txtCorreo').value,
            /* telefono: document.getElementById('txtTelefono').value, */
            rol: document.getElementById('selRol').value,
            password: txtPassword
        };

        fetch(url, {
            method: 'POST',
            mode: 'cors',
            body: JSON.stringify(usuario),
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
                        window.location.href = '/listarUsuarios';
                    }, 2000);
                }
            })
            .catch((error) => {
                
                console.error('Error al registrar usuario:', error);
                Swal.fire({
                    position: 'center',
                    icon: 'error',
                    title: '¡Error al Registrar Usuario!',
                    text: 'No se pudo procesar la solicitud, Inténtelo nuevamente.',
                    showConfirmButton: false,
                    timer: 1500
                })
                window.location.reload();
            });
    }

}

// ============================================================

const modificarUsuarios = async () => {

    const campos = [
        { id: 'txtNombres', label: 'Nombres', validacion: valid.validarNombre },
        { id: 'txtApellidos', label: 'Apellidos', validacion: valid.validarApellido },
        { id: 'txtUsername', label: 'Telefono', validacion: valid.validarUsername},
        { id: 'txtCorreo', label: 'Tipo Documento', validacion: valid.validarCorreo},
        { id: 'selRol', label: 'Numero Documento'},
    ];

    if (!alert.validarCampos(campos)) {
        return;
    }else{
        
        const usuarios = {
            _id: document.getElementById('txtID').value,
            nombres: document.getElementById('txtNombres').value,
            apellidos: document.getElementById('txtApellidos').value,
            username: document.getElementById('txtUsername').value, 
            correo: document.getElementById('txtCorreo').value, 
            rol: document.getElementById('selRol').value
        };

        fetch(url, {
            method: 'PUT',
            mode: 'cors',
            body: JSON.stringify(usuarios),
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
                        window.location.href = '/listarUsuarios';
                    }, 2000);
                }
            })
            .catch((error) => {
                
                console.error('Error al registrar usuario:', error);
                Swal.fire({
                    position: 'center',
                    icon: 'error',
                    title: '¡Error al Modificar Usuario!',
                    text: 'No se pudo procesar la solicitud, Inténtelo nuevamente.',
                    showConfirmButton: false,
                    timer: 1500
                })
                window.location.reload();
            });
    }

}

const eliminarUsuarios = (id) => {

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
                title: '¡Usuario Eliminado Exitosamente!',
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
                Swal.fire('Error', 'Se produjo un error al eliminar el usuario.', 'error');
            });
        }
    });
};



document.addEventListener("DOMContentLoaded", function () {

    const PageUrl = window.location.href;

    // Verificar si la URL contiene "listarusuarios"
    if (PageUrl.includes("/listarUsuarios")) {
        listarUsuarios();

        document.getElementById('btnMdReset').
        addEventListener('click', () => {
            document.getElementById('formModificar').reset()
        })

        document.getElementById('btnMdGuardar').
        addEventListener('click', () => {
            modificarUsuarios()
        })


        document.getElementById('btnGenerar').
        addEventListener('click', (event) => {
            event.preventDefault()
            
            Swal.fire({
                title: '¿Estas Seguro?',
                text: 'Se generar un reporte de los usuarios',
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

    if(PageUrl.includes("/crearUsuario")){

        document.getElementById('btnGuardar').
        addEventListener('click', () => {
            crearUsuarios();
        })

        document.getElementById('btnReset').
        addEventListener('click', (event) => {
            event.preventDefault()
            document.getElementById('formModificar').reset()
        })

        document.getElementById('btnCancelar').
        addEventListener('click', (event) => {
            event.preventDefault()
            
            Swal.fire({
                title: '¿Estas Seguro?',
                text: 'No se registrará ningún Usuario',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Sí, Salir',
                cancelButtonText: 'Cancelar',
            }).then((result) => {
                if (result.isConfirmed) {
                    setTimeout(() => {
                        window.location.href = '/listarUsuarios';
                    }, 1800);
                }
            });
        })
    }

        

});






