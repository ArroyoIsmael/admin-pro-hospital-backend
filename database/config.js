const mongoose = require('mongoose');
require('dotenv').config();

const dbConnection = async() => {

    try {
        await mongoose.connect(process.env.DB_CNN, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false
        });
        console.log('DB Online');
    } catch (error) {
        console.log(error);
        throw new Error('Error de conexion a la bd');
    }


}


module.exports = {
    dbConnection
}