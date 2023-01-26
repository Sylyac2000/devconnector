const mongoose = require('mongoose');
//get config from default.json
const config = require('config');

const db = config.get('mongoURI');

const connectDb = async () => {
    try {
        await mongoose.connect(db);
        console.log('Mongo connected');
    } catch (err) {
        console.error(err.message);
        //exit with failure
        process.exit(1);

    }
}
module.exports = connectDb;

