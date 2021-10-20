const { response } = require('express');
const Usuario = require('../models/usuario');
const bcrypt = require('bcryptjs');
const { generarJWT } = require('../helpers/jwt');



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

module.exports = {
    login
}