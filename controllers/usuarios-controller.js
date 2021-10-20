const { response } = require('express');
const bcrypt = require('bcryptjs');
const { generarJWT } = require('../helpers/jwt');

//Modelo usuarios
const Usuario = require('../models/usuario');


//Get Users
const getUsuarios = async(req, res) => {
    const usuarios = await Usuario.find({}, 'nombre email role google');

    res.json({
        ok: true,
        usuarios
    })
}

//Create Users
const crearUsuario = async(req, res = response) => {
    const { email, password } = req.body;

    try {

        const existeEmail = await Usuario.findOne({ email });

        if (existeEmail) {
            return res.status(400).json({
                ok: false,
                msg: 'El correo ya está registrado'
            });
        }

        const usuario = new Usuario(req.body);

        //Encriptar password

        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync(password, salt);

        await usuario.save();

        const token = await generarJWT(usuario.id);

        res.json({
            ok: true,
            usuario,
            token
        });

    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado... Revisar Logs'
        });
    }



}

const actualizarUsuario = async(req, res = response) => {

    //TODO: Validar token y comprobar el role de usuario


    const uid = req.params.id;


    try {

        const userDb = await Usuario.findById(uid);

        if (!userDb) {
            return res.status(404).json({
                ok: false,
                msg: 'El usuario no pudo ser encontrado'
            });
        }
        //Actualizaciones
        const { password, google, email, ...campos } = req.body;

        if (userDb.email != email) {
            const existeEmail = await Usuario.findOne({ email });

            if (existeEmail) {
                return res.status(400).json({
                    ok: false,
                    msg: 'Ya existe un usuario con ese email'
                });
            }
        }

        campos.email = email;
        const usuarioActualizado = await Usuario.findByIdAndUpdate(uid, campos, { new: true });



        res.json({
            ok: true,
            usuario: usuarioActualizado
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado ...'
        })
    }
}

const borrarUsuario = async(req, res = response) => {
    const uid = req.params.id;

    try {
        const userDb = await Usuario.findById(uid);

        if (!userDb) {
            return res.status(404).json({
                ok: false,
                msg: 'El usuario no pudo ser encontrado'
            });
        }

        await Usuario.findByIdAndDelete(uid);
        res.json({
            ok: true,
            msg: 'Usuario eliminado'
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado ...'
        })
    }
}

module.exports = {
    getUsuarios,
    crearUsuario,
    actualizarUsuario,
    borrarUsuario
}