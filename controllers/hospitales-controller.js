const { response } = require("express")
const Hospital = require('../models/hospital');

const getHospitales = async(req, res = response) => {

    const hospitales = await Hospital.find()
        .populate('usuario', 'nombre img')
    res.json({
        ok: true,
        hospitales
    })
}

const crearHospital = async(req, res = response) => {

    const uid = req.uid;
    const hospital = new Hospital({
        usuario: uid,
        ...req.body
    });

    try {

        const hospitalDB = await hospital.save();

        res.json({
            ok: true,
            hospital: hospitalDB
        })
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado'
        });
    }

}

const actualizarHospital = async(req, res = response) => {

    const hospital_id = req.params.id;
    const uid = req.uid;

    try {
        ///Verificar si existe hospital

        const hospitalDb = await Hospital.findById(hospital_id);

        if (!hospitalDb) {

            return res.status(404).json({
                ok: false,
                msg: 'No existe hospital'
            });
        }
        const cambiosHospital = {
            ...req.body,
            usuario: uid
        }

        const hospitalActualizado = await Hospital.findByIdAndUpdate(hospital_id, cambiosHospital, { new: true });

        res.json({
            ok: true,
            hospital: hospitalActualizado
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }

}

const borrarHospital = async(req, res = response) => {

    const hospital_id = req.params.id;


    try {
        ///Verificar si existe hospital

        const hospitalDb = await Hospital.findById(hospital_id);

        if (!hospitalDb) {

            return res.status(404).json({
                ok: false,
                msg: 'No existe hospital'
            });
        }



        await Hospital.findByIdAndDelete(hospital_id);

        res.json({
            ok: true,
            msg: 'Hospital Eliminado'
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
    getHospitales,
    crearHospital,
    actualizarHospital,
    borrarHospital
}