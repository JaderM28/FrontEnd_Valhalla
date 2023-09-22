
import * as valid from '../validations/expresiones.mjs';
import * as alert from '../validations/alertas.mjs';

const validarAcceso = () => {

    const campos = [
        { 
            id: 'txtUsername', 
            label: 'Username',
            msg: 'el campo debe contener entre 3 y 16 caracteres, que pueden ser letras, números o guiones bajos.', 
            validacion: valid.validarUsername
        },
        { 
            id: 'txtCorreo', 
            label: 'Correo',
            msg: 'el campo debe tener un formato con un "@" y un dominio correcto.' , 
            validacion: valid.validarCorreo 
        },
        { 
            id: 'txtPassword', 
            label: 'Contraseña',
            msg: 'el campo debe contener al menos 8 caracteres, incluyendo mayúsculas y números.', 
            validacion: valid.validarPassword},
    ];

    const datos = {
        usuarioValido: 'Admin',
        correoValido: 'Admin28@gmail.com',
        passwordvalido: 'Admin123',
        username: document.getElementById('txtUsername').value,
        correo: document.getElementById('txtCorreo').value,
        password: document.getElementById('txtPassword'),
    };

    if (!alert.validarCampos(campos)) {
        return;
    }

    if(datos.username === datos.usuarioValido &&
        datos.correo === datos.correoValido && 
        datos.password === datos.password){

            Swal.fire({
                position: 'center',
                icon: 'success',
                title: '¡Login Exitoso!',
                text: 'Se validaron las credenciales, bienvenido!',
                showConfirmButton: false,
                timer: 1500
            })
            setTimeout(() => {
                window.location.href = '/panelAdministrativo';
            }, 2000);
    }else{
        Swal.fire({
            position: 'center',
            icon: 'error',
            title: '¡Error Login!',
            text: 'las credenciales no son correctas, intentelo nuevamente!',
            showConfirmButton: false,
            timer: 1500
        })
    }

}

// Funcion Recuperar Contraseña
const recuperarPassword = () => {

    const campos = [
        { 
            id: 'txtCorreo',
            label: 'Correo', 
            msg: 'el campo debe tener un formato con un "@" y un dominio correcto.',
            validacion: valid.validarCorreo 
        },
        { 
            id: 'txtPassword', 
            label: 'Contraseña', 
            msg: 'el campo debe contener al menos 8 caracteres, incluyendo mayúsculas y números.',
            validacion: valid.validarPassword
        },
    ];

    const datos = {
        
    };

    if (!alert.validarCampos(campos)) {
        return;
    }else{

        Swal.fire({
            position: 'center',
            icon: 'success',
            title: '¡Envio Exitoso!',
            text: 'Se envio un correo de recuperacion a tu correo!',
            showConfirmButton: false,
            timer: 2000
        })
        setTimeout(() => {
            window.location.href = '/';
        }, 2500);
    }
}

// Funcion Validar Registro de Usuario
const validarRegistro = async () => {

    const campos = [
        { 
            id: 'txtUsername', 
            label: 'Username',
            msg: 'el campo debe contener entre 3 y 16 caracteres, que pueden ser letras, números o guiones bajos.',
            validacion: valid.validarUsername
        },
        { 
            id: 'txtNombres', 
            label: 'Nombre',
            msg: 'el campo debe contener solo letras o caracteres.', 
            validacion: valid.validarNombre 
        },
        { 
            id: 'txtCorreo', 
            label: 'Correo',
            msg: 'el campo debe tener un formato con un "@" y un dominio correcto.', 
            validacion: valid.validarCorreo 
        },
        { 
            id: 'txtPassword', 
            label: 'Contraseña',
            msg: 'el campo debe contener al menos 8 caracteres, incluyendo mayúsculas y números.', 
            validacion: valid.validarPassword
        },
        { 
            id: 'txtPasswordRepeat', 
            label: 'Confirmar Contraseña',
            msg: 'el campo debe contener al menos 8 caracteres, incluyendo mayúsculas y números.', 
            validacion: valid.validarPassword 
        },
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
        Swal.fire({
            position: 'center',
            icon: 'success',
            title: '¡Registro Exitoso!',
            text: 'los datos fueron registrados correctamente!',
            showConfirmButton: false,
            timer: 1500
        })
        window.location.reload()
        const usuario = {
            nombres: document.getElementById('txtNombres').value,
            username: document.getElementById('txtUsername').value,
            correo: document.getElementById('txtCorreo').value,
            rol: document.getElementById('selRol').value = 'Usuario',
            password: txtPassword,
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
                    window.location.href = '/';
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



// Eventos Botones Funciones Acceso
document.addEventListener("DOMContentLoaded", function () {

    const PageUrl = window.location.href;
    
    if (PageUrl.includes("/register")){
        document.getElementById('btnRcontinuar').
        addEventListener('click', (event) => {
            event.preventDefault()
            validarRegistro()
        })
    }else if(PageUrl.includes("/forgot")){
        document.getElementById('btnFContinuar').
        addEventListener('click', (event) => {
            event.preventDefault()
            recuperarPassword()
        })
    }else{
        document.getElementById('btnContinuar').
        addEventListener('click', (event) => {
            event.preventDefault();
            validarAcceso();
        })
    }

});