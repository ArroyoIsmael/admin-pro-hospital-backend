const path = require('path');
const fs = require('fs');

const { response } = require('express');
const { v4: uuidv4 } = require('uuid');

const { updateImage } = require('../helpers/updateImg');

const uploadFile = async(req, res) => {

    const tipo = req.params.tipo;
    const id = req.params.id;

    const tiposvalidos = ['usuarios', 'medicos', 'hospitales'];

    if (!tiposvalidos.includes(tipo)) {

        return res.status(400).json({
            ok: false,
            msg: 'No es valido el tipo'
        });
    }
    //Validar si existe un archivo
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
            ok: false,
            msg: 'No hay ningun archivo'
        });
    }

    //Procesar la imagen
    const file = req.files.imagen;
    const nombrecortado = file.name.split('.');
    const extensionArchivo = nombrecortado[nombrecortado.length - 1];

    //Validar Extension

    const extensionesValidas = ['png', 'jpg', 'jpeg', 'gif'];

    if (!extensionesValidas.includes(extensionArchivo)) {

        return res.status(400).json({
            ok: false,
            msg: 'No es valido el tipo de formato'
        });
    }

    //Generar nombre de archivo

    const nombreArchivo = `${uuidv4()}.${extensionArchivo}`;

    //PATH para guardar imagen
    const path = `./uploads/${tipo}/${nombreArchivo}`;

    // Use the mv() method to place the file somewhere on your server
    file.mv(path, (err) => {
        if (err) {
            console.log(err);
            return res.status(500).json({
                ok: false,
                msg: 'Error al mover la imagen'
            });
        }

        //Actualizar BD
        updateImage(tipo, id, nombreArchivo);


        res.json({
            ok: true,
            msg: 'Archvio subido',
            nombreArchivo
        });

    });

}

const returnImg = (req, res) => {

    const tipo = req.params.tipo;
    const img = req.params.foto;

    const pathImg = path.join(__dirname, `../uploads/${tipo}/${img}`);

    //imagen por defecto
    if (fs.existsSync(pathImg)) {
        res.sendFile(pathImg);
    } else {
        res.sendFile(path.join(__dirname, `../uploads/no-img.jpg`));
    }





}


module.exports = {
    uploadFile,
    returnImg
}