const { response } = require('express');
const Usuario = require('../models/usuario');
const bcrypt = require('bcryptjs');
const { generarJWT } = require('../helpers/jwt');
const { googleVerify } = require('../helpers/google-verify');



const login = async(req, res = response) => {

    const { email, password } = req.body;

    try {
        const userDB = await Usuario.findOne({ email });
        //Verificar email
        if (!userDB) {
            return res.status(404).json({
                ok: false,
                msg: 'Email no encontrado'
            });
        }

        //Verificar password

        const validPassword = bcrypt.compareSync(password, userDB.password);

        if (!validPassword) {
            return res.status(404).json({
                ok: false,
                msg: 'Contraseña no valida'
            });
        }

        //Generar token
        const token = await generarJWT(userDB.id);

        res.json({
            ok: true,
            token
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado... Revisar Logs'
        });
    }

}

const googleSignIn = async(req, res = response) => {

    const googleToken = req.body.token;

    try {

        const { name, email, picture } = await googleVerify(googleToken);

        const usuarioDB = await Usuario.findOne({ email });

        let usuario;

        //Verificamos si ya existe
        if (!usuarioDB) {

            usuario = new Usuario({
                nombre: name,
                email,
                password: '@@@@',
                img: picture,
                google: true
            });

        } else {

            usuario = usuarioDB;
            usuario.google = true;

        }

        //Guardar en bd
        await usuario.save();

        //Generar json web token
        const token = await generarJWT(usuario.id);

        res.json({
            ok: "true",
            token

        });


    } catch (error) {
        res.status(401).json({
            ok: false,
            msg: 'Token incorrecto'
        });
    }

}

module.exports = {
    login,
    googleSignIn
}