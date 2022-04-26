const { response } = require("express")
const Medico = require('../models/medico');

const getMedicos = async(req, res = response) => {

    const medicos = await Medico.find()
        .populate('usuario', 'nombre img')
        .populate('hospital', 'nombre')

    res.json({
        ok: true,
        medicos
    })
}

const crearMedico = async(req, res = response) => {

    const uid = req.uid;
    const medico = new Medico({
        usuario: uid,
        ...req.body
    });

    try {

        const medicoDB = await medico.save();

        res.json({
            ok: true,
            medico: medicoDB
        })
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado'
        });
    }

}

const actualizarMedico = async(req, res = response) => {

    const medico_id = req.params.id;
    const uid = req.uid;

    try {

        //Verificamos si existe medico

        const medicoDB = await Medico.findById(medico_id);

        if (!medicoDB) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe medico'
            });

        }

        const medicoData = {
            ...req.body,
            usuario: uid
        };

        const medicoActualizado = await Medico.findByIdAndUpdate(medico_id, medicoData, { new: true });

        res.json({
            ok: true,
            medicoActualizado
        })



    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }
}

const borrarMedico = async(req, res = response) => {
    const medico_id = req.params.id;

    try {

        //Verificamos si existe medico

        const medicoDB = await Medico.findById(medico_id);

        if (!medicoDB) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe medico'
            });

        }

        await Medico.findByIdAndDelete(medico_id);

        res.json({
            ok: true,
            msg: 'Medico eliminado'
        })



    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }
}
module.exports = {
    getMedicos,
    crearMedico,
    actualizarMedico,
    borrarMedico
}