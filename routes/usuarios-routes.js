/*
    Ruta: /api/usuarios

*/
const { Router } = require('express');
const { check } = require('express-validator');


const { getUsuarios, crearUsuario, actualizarUsuario, borrarUsuario } = require('../controllers/usuarios-controller');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');


const router = Router();

router.get('/', validarJWT, getUsuarios);

router.post('/', [
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        check('password', 'Contraseña obligatoria').not().isEmpty(),
        check('email', 'El Email es obligatorio').isEmail(),
        validarCampos,

    ],
    crearUsuario);

router.put('/:id', [
        validarJWT,
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        check('email', 'El Email es obligatorio').isEmail(),
        check('role', 'El Rol es obligatorio').not().isEmpty(),
        validarCampos,

    ],
    actualizarUsuario);

router.delete('/:id', validarJWT, borrarUsuario);

module.exports = router;