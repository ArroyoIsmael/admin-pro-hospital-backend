/*
    Path: '/api/login'
*/
const { Router } = require('express');
const { login, googleSignIn } = require('../controllers/auth-controller');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');


const router = Router();

router.post('/', [
        check('email', 'El email es obligatorio').isEmail(),
        check('password', 'Contraseña obligatoria').not().isEmpty(),
        validarCampos,
    ],
    login);

router.post('/google', [
        check('token', 'Token de google obligatorio').not().isEmpty(),
        validarCampos,
    ],
    googleSignIn);


module.exports = router;