//Modelo usuarios
const Usuario = require('../models/usuario');
const Medico = require('../models/medico');
const Hospital = require('../models/hospital');
const fs = require('fs');

const borrarImagen = (path) => {
    if (fs.existsSync(path)) {
        fs.unlinkSync(path);
    }

}



const updateImage = async(tipo, id, nombreArchivo) => {

    let pathViejo = '';
    switch (tipo) {
        case 'medicos':
            const medico = await Medico.findById(id);
            if (!medico) {
                console.log('No es un medico por id');
                return false;

            }
            pathViejo = `./uploads/medicos/${medico.img}`;
            borrarImagen(pathViejo);

            medico.img = nombreArchivo;
            medico.save();
            return true;

            break;

        case 'hospitales':
            const hospital = await Hospital.findById(id);
            if (!hospital) {
                console.log('No es un hospital por id');
                return false;

            }
            pathViejo = `./uploads/hospitales/${hospital.img}`;
            borrarImagen(pathViejo);

            hospital.img = nombreArchivo;
            hospital.save();
            return true;

            break;

        case 'usuarios':

            const usuario = await Usuario.findById(id);
            if (!usuario) {
                console.log('No es un Usuario por id');
                return false;

            }
            pathViejo = `./uploads/usuarios/${usuario.img}`;
            borrarImagen(pathViejo);

            usuario.img = nombreArchivo;
            usuario.save();
            return true;

            break;

        default:
            break;
    }
}


module.exports = {
    updateImage
}