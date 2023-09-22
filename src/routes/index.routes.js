// ================================= \\
// Requerir Dependencia

const {Router} = require('express');
const router = Router()


// ================================= \\
// Rutas index

router.get('/', (req, res) => {
    res.render('acceso/login', {
        login: false
    })
})

router.get('/register', (req, res) => {
    res.render('acceso/register', {
        login: false
    })
})

router.get('/forgot', (req, res) => {
    res.render('acceso/forgot-password', {
        login: false
    })
})


router.get('/panelAdministrativo', (req, res) => {
    res.render('index', {
        global: true,
        dasboard: true
    })
})


// ================================= \\
// Rutas Usuarios

router.get('/listarUsuarios', (req, res) => {
    res.render('usuarios/listarUsuarios', {
        global: true,
        tabla: true,
        usuarioR: true
    })
})

router.get('/crearUsuario', (req, res) => {
    res.render('usuarios/formUsuarios', {
        global: true,
        usuarioR: true
    })
})


// ================================= \\
// Rutas Clientes

router.get('/listarClientes', (req, res) => {
    res.render('clientes/listarClientes', {
        global: true,
        tabla: true,
        clienteR: true
    })
})



// ================================= \\
// Rutas Empleado

router.get('/listarEmpleados', (req, res) => {
    res.render('empleados/listarEmpleados', {
        global: true,
        tabla: true,
        empleadoR: true
    })
})


// ================================= \\
// Rutas Categorias

router.get('/listarCategorias', (req, res) => {
    res.render('categorias/listarCategorias', {
        global: true,
        tabla: true,
        categoriaR:true,
    })
})

router.get('/crearCategorias', (req, res) => {
    res.render('categorias/formCategorias', {
        global: true,
        categoriaR: true,
    })
})

// ================================= \\
// Rutas Servicios

router.get('/listarServicios', (req, res) => {
    res.render('servicios/listarServicios', {
        global: true,
        tabla: true,
        servicioR:true,
    })
})

router.get('/crearServicios', (req, res) => {
    res.render('servicios/formServicios', {
        global: true,
        servicioR: true,
    })
})


// ================================= \\
// Rutas Reservas

router.get('/listarReservas', (req, res) => {
    res.render('reservas/listarReservas', {
        global: true,
        tabla: true,
        reservasR: true,
    })
})


// ================================= \\
// Rutas Ventas

router.get('/listarVentas', (req, res) => {
    res.render('ventas/listarVentas', {
        global: true,
        ventaR: true
    })
})
// ================================= \\
// Rutas Configuracion/roles

router.get('/listarRoles', (req, res) => {
    res.render('configuracion/listarRoles', {
        global: true,
        tabla: true,
        configuracionR: true
    })
})
router.get('/crearRoles', (req, res) => {
    res.render('configuracion/formRoles', {
        global: true,
        configuracionR: true
    })
})

// ================================= \\
// Ruta Error

router.get('*', (req, res) => {
    res.render('404')
})

// ================================= \\
// Exportacion

module.exports = router
