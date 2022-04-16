/*
    Ruta: /api/uploads/:busqueda

*/
const { Router } = require('express');
const expressFileUpload = require('express-fileupload');
const { check } = require('express-validator');

const { validarJWT } = require('../middlewares/validar-jwt');

const {
    uploadFile,
    returnImg
} = require('../controllers/uploads-controller');

const router = Router();

// default options
router.use(expressFileUpload(expressFileUpload));

router.put('/:tipo/:id', [
    validarJWT,
    uploadFile
]);

router.get('/:tipo/:foto', [
    validarJWT,
    returnImg
]);

module.exports = router;