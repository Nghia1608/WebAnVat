const mongoose = require('mongoose');

async function connect(){
    try {
        await mongoose.connect('mongodb://localhost:27017/WebAnVat');
        console.log("da ket noi");
    } catch (error) {
        console.log("fail");
        
    }
}
module.exports = {connect};