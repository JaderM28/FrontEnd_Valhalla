
export const validarNombre = (nombre) => {
    const result = /^[A-Za-zÁáÉéÍíÓóÚúÜüÑñ\s]+$/;
    return result.test(nombre)
}

export const validarApellido = (apellido) => {
    const result = /^[A-Za-zÁáÉéÍíÓóÚúÜüÑñ\s]+$/;
    return result.test(apellido)
}

export const validarUsername = (username) => {
    const resut = /^[a-zA-Z0-9_]{3,16}$/;
    return resut.test(username)
}

export const validarCorreo = (correo) => {
    const result = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return result.test(correo)
}

export const validarTelefono = (telefono) => {
    const result = /^\d{10}$/;
    return result.test(telefono)
}

export const validarPassword = (password) => {
    const result = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
    return result.test(password)
}

export const validarDireccion = (direccion) => {
    const result = /^[A-Za-z0-9\s#\-áéíóúÁÉÍÓÚüÜñÑ.,()]+$/; 
    return result.test(direccion)
}

export const validarGenero = (genero) => {
    const result = /^(Masculino|Femenino)$/;
    return result.test(genero)
}

export const validarDocumento = (documento) => {
    const result = /^\d{10}$/;
    return result.test(documento)
}

export const validarTextArea = (text) => {
    const result = /^[A-Za-z0-9\s,.]+$/;
    return result.test(text)
}

export const validarCodigo = (codigo) => {
    const result = /^[A-Za-z0-9\-_]+$/;
    return result.test(codigo)
}

export const validarPrecio = (precio) => {
    const result = /^\d+(\.\d{1,3})?$/;
    return result.test(precio);
}

export const validarDuracion = (duracion) => {
    const result = /^\d+:\d+$/;
    return result.test(duracion);
}

export const validarRol = (rol) => {
    const result = /^[A-Za-z]+$/;
    return result.test(rol)
}

