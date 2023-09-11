import * as valid from '../validations/expresiones.mjs';
import * as alert from '../validations/alertas.mjs';

const url = 'https://backend-valhalla.onrender.com/ruta/servicios';

const listarServicios = async () => {
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
        const listaClientes = data.clientes;
        console.log(listaClientes)
        // Agregar un índice autoincremental y fecha de registro a los datos
        listaClientes.forEach((cliente, index) => {
            cliente.index = index + 1;
            cliente.fecha_registro = new Date().toLocaleDateString('en-US', { weekday: "long", year: "numeric", month: "short", day: "numeric" });
            
            cliente.botones_accion = `
                <div class=" d-flex justify-content-around">
                    <a href="" class="btn btn-primary" data-toggle="modal" data-target="#UpdateModal" onclick='verClientes(${JSON.stringify(cliente)})'><i class="fas fa-edit" ></i></a>
                    <a href="" class="btn btn-danger" onclick="eliminarUsuarios('${cliente._id}')"><i class="fas fa-trash-alt"></i></a>
                    <a href="" class="btn btn-warning" data-toggle="modal" data-target="#ShowModal" ><i class="fas fa-eye"></i></a>
                </div>
            `;
        });

        tabla.clear().draw();
        tabla.rows.add(listaClientes).draw(); 
    })
    .catch(function (error) {
        console.error('Error:', error);
    });
}




const modificarClientes = async () => {

    const campos = [
        { id: 'txtNombres', label: 'Nombres', validacion: valid.validarNombre },
        { id: 'txtApellidos', label: 'Apellidos', validacion: valid.validarApellido },
        { id: 'txtTelefono', label: 'Telefono', validacion: valid.validarTelefono},
        { id: 'selDocumento', label: 'Tipo Documento'},
        { id: 'txtNumDocumento', label: 'Numero Documento', validacion: valid.validarDocumento},
        { id: 'txtGenero', label: 'Genero', validacion: valid.validarGenero},
        { id: 'txtDireccion', label: 'Direccion', validacion: valid.validarDireccion}
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
                
                console.error('Error al registrar usuario:', error);
                Swal.fire({
                    position: 'center',
                    icon: 'error',
                    title: '¡Error al Registrar Servicio!',
                    text: 'No se pudo procesar la solicitud, Inténtelo nuevamente.',
                    showConfirmButton: false,
                    timer: 1500
                })
                window.location.reload();
            });
    }

}



// Eventos JavaScript CLientes

document.addEventListener("DOMContentLoaded", function () {

    const PageUrl = window.location.href;

    // Verificar si la URL contiene "listarusuarios"
    if (PageUrl.includes("/listarServicios")) {
        listarServicios();


        document.getElementById('btnMdReset').
        addEventListener('click', () => {
            document.getElementById('formModificar').reset()
        })

        document.getElementById('btnMdGuardar').
        addEventListener('click', () => {
            modificarServicios()
        })



    }

});
