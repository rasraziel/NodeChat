const mongoose = require('mongoose');
const msgSchema = new mongoose.Schema({
        name: String,
        message: String,
        style: String
})

const Msg = mongoose.model('Msg', msgSchema);
module.exports = Msg;