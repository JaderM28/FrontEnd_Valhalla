import * as valid from '../validations/expresiones.mjs';
import * as alert from '../validations/alertas.mjs';

// Se crea la constante con la Url del API
const url = 'https://backend-valhalla.onrender.com/ruta/categorias';

// ======================= LISTAR ===================================

// Funcion Listar Categorias
const listarCategorias = async () => {
    const tabla = $('#dataTable').DataTable({

        "bProcessing": true, // Habilita la pantalla de carga
        "serverSide": false, 

        "columns": [
            { "data": "index" }, // Índice autoincremental
            { "data": "codigoCategoria" }, 
            { "data": "nombre" },
            { "data": "descripcion" },
            { "data": "fecha_registro" },
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
        const listaCategorias = data.categoria;
        console.log(listaCategorias)
        // Agregar un índice autoincremental y fecha de registro a los datos
        listaCategorias.forEach((categoria, index) => {
            categoria.index = index + 1;
            categoria.fecha_registro = new Date().toLocaleDateString('es-ES');

            if (categoria.estado) {
                categoria.estado =`<i class="fas fa-toggle-on fa-2x text-success" id="cambiar-estado" data-index="${categoria._id}" data-estado="${categoria.estado}"></i>`;
            } else {
                categoria.estado =`<i class="fas fa-toggle-on fa-rotate-180 fa-2x text-danger" id="cambiar-estado" data-index="${categoria._id}" data-estado="${categoria.estado}"></i>`;
            }     
            categoria.botones_accion = `
                <div class=" d-flex justify-content-around">
                    <a href="" class="btn btn-primary" id="btnUpdate" data-index="${categoria._id}" data-toggle="modal" data-target="#UpdateModal" onclick='verCategorias(${JSON.stringify(categoria)})'><i class="fas fa-edit" ></i></a>
                    <a href="" class="btn btn-danger" id="btnDelete" data-index="${categoria._id}"><i class="fas fa-trash-alt"></i></a>
                </div>
            `;
        });

        tabla.clear().draw();
        tabla.rows.add(listaCategorias).draw();

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

        tabla.on('click', '#btnDelete', function (event) {
            event.preventDefault()
            const button = this;
            const categID = button.getAttribute('data-index');
            eliminarCategorias(categID);
        })

        tabla.on('click', '#btnUpdate', function () {
            document.getElementById('formModificar').reset()
            const button = this;
            const categID = button.getAttribute('data-index');
            verCategorias(categID);
        })

        

    })
    .catch(function (error) {
        console.error('Error:', error);
    });
}

// ======================= LISTAR MODAL ===================================

// Funcion Ver Datos Modal
const verCategorias = async (categoria) => {

    await fetch(url+`/${categoria}`, {
        method: 'GET',
        mode: 'cors',
        headers: { "Content-type": "application/json; charset=UTF-8" }
    })
    .then((resp) => resp.json())
    .then((data) => {
        const categorias = data.categoriaID; 
        console.log(categorias)
        document.getElementById('txtID').value = categorias._id
        document.getElementById('txtNombre').value = categorias.nombre
        document.getElementById('txtCodigo').value = categorias.codigoCategoria
        document.getElementById('txtDescripcion').value = categorias.descripcion
        document.getElementById('txtObservaciones').value = categorias.observaciones
    })
    .catch((error) => {
        console.log('Error: ', error);
    });
}

// ======================= CAMBIAR ESTADO ===================================

// Funcion Cambiar Estado Categorias
function cambiarEstado(userId, newEstado) {

    const categorias = {
        _id: userId,
        estado:newEstado,
    };

    fetch(url, {
        method: 'PUT',
        mode: 'cors',
        body: JSON.stringify(categorias),
        headers: { 'Content-type': 'application/json; charset=UTF-8' },
    })
    .catch((error) => {
        console.error('Error:', error);
        Swal.fire('Error', 'Se produjo un error al cambiar estado usuario.', 'error');
    });
}    

// ======================= CREAR ===================================

// Funcion Crear Categorias
const crearCategorias = async () => {

    const campos = [
        { 
            id: 'txtNombre', 
            label: 'Nombre Categoria',
            msg: 'el campo debe contener solo letras o caracteres.',
            validacion: valid.validarNombre 
        },
        { 
            id: 'txtCodigo', 
            label: 'Codigo Categoria',
            msg: 'el campo debe contener solo letras o numeros , eslace o guion bajo', 
            validacion: valid.validarCodigo 
        },
        { 
            id: 'txtDescripcion', 
            label: 'Descripcion Categoria', 
            msg: 'el campo debe contener solo letras o caracteres.',
            validacion: valid.validarTextArea
        },
        { 
            id: 'txtObservaciones', 
            label: 'Observaciones Categoria', 
            msg: 'el campo debe contener solo letras o caracteres.',
            validacion: valid.validarTextArea
        }
    ];

    if (!alert.validarCampos(campos)) {
        return;
    }else{
        
        const categorias = {
            nombre: document.getElementById('txtNombre').value,
            codigoCategoria: document.getElementById('txtCodigo').value,
            descripcion: document.getElementById('txtDescripcion').value,
            observaciones: document.getElementById('txtObservaciones').value,
        };

        fetch(url, {
            method: 'POST',
            mode: 'cors',
            body: JSON.stringify(categorias),
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
                        window.location.href = '/listarCategorias';
                    }, 2000);
                }
            })
            .catch((error) => {
                
                console.error('Error al registrar categoría:', error);
                Swal.fire({
                    position: 'center',
                    icon: 'error',
                    title: '¡Error al Registrar Categoría!',
                    text: 'No se pudo procesar la solicitud, Inténtelo nuevamente.',
                    showConfirmButton: false,
                    timer: 1500
                })
                window.location.reload();
            });
    }

}

// ======================= MODIFICAR ===================================

// Funcion Modificar Categorias
const modificarCategorias = async () => {

    const campos = [
        { 
            id: 'txtNombre', 
            label: 'Nombre Categoria',
            msg: 'el campo debe contener solo letras o caracteres.',
            validacion: valid.validarNombre 
        },
        { 
            id: 'txtCodigo', 
            label: 'Codigo Categoria',
            msg: 'el campo debe contener solo letras o numeros , enlace o guion bajo', 
            validacion: valid.validarCodigo 
        },
        { 
            id: 'txtDescripcion', 
            label: 'Descripcion Categoria', 
            msg: 'el campo debe contener solo letras o caracteres.',
            validacion: valid.validarTextArea
        },
        { 
            id: 'txtObservaciones', 
            label: 'Observaciones Categoria', 
            msg: 'el campo debe contener solo letras o caracteres.',
            validacion: valid.validarTextArea
        }
    ];

    if (!alert.validarCampos(campos)) {
        return;
    }else{
        
        const categorias = {
            _id: document.getElementById('txtID').value,
            nombre: document.getElementById('txtNombre').value,
            codigoCategoria: document.getElementById('txtCodigo').value,
            descripcion: document.getElementById('txtDescripcion').value,
            observaciones: document.getElementById('txtObservaciones').value,
        };

        fetch(url, {
            method: 'PUT',
            mode: 'cors',
            body: JSON.stringify(categorias),
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
                    window.location.href = '/listarCategorias';
                }, 2000);
            }
        })
        .catch((error) => {
            
            console.error('Error al registrar categoria:', error);
            Swal.fire({
                position: 'center',
                icon: 'error',
                title: '¡Error al Registrar Categoría!',
                text: 'No se pudo procesar la solicitud, Inténtelo nuevamente.',
                showConfirmButton: false,
                timer: 1500
            })
            window.location.reload();
        });
    }
}

// ======================= ELIMINAR ===================================

// Funcion Eliminar Categorias
const eliminarCategorias = (id) => {
    
    Swal.fire({
        title: '¿Está seguro de realizar la eliminación?',
        text: 'Esta acción no se puede deshacer.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar',
    }).then((result) => {
        if (result.isConfirmed) {
            let categoria = {
                _id: id,
            };
            fetch(url, {
                method: 'DELETE',
                mode: 'cors',
                body: JSON.stringify(categoria),
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

// ======================= EVENTOS ===================================

// Eventos Botones Categorias
document.addEventListener("DOMContentLoaded", function () {

    const PageUrl = window.location.href;

    // Comprueba la URL listar Categorias
    if (PageUrl.includes("/listarCategorias")) {

        // Se llama funcion listar Categorias
        listarCategorias();

        // Evento Resetear Formulario
        document.getElementById('btnMdReset').
        addEventListener('click', () => {
            document.getElementById('formModificar').reset()
        })

        // Evento Confimrar Modificacion Datos 
        document.getElementById('btnMdGuardar').
        addEventListener('click', () => {
            modificarCategorias()
        })

    }

    // Comprueba la URL Crear Categorias
    if(PageUrl.includes("/crearCategorias")){

        // Evento Guardar Datos Formulario
        document.getElementById('btnGuardar').
        addEventListener('click', () => {
            crearCategorias();
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
                text: 'No se registrará ninguna categoría',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Sí, Salir',
                cancelButtonText: 'Cancelar',
            }).then((result) => {
                if (result.isConfirmed) {
                    setTimeout(() => {
                        window.location.href = '/listarCategorias';
                    }, 1800);
                }
            });
        })
    }

});

