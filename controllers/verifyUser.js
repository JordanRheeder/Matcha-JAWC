const con = require("../models/dbcon");
const mongoose = require('mongoose');

// var uri = process.env.URI;
// mongoose.connect(uri, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
// }); 
// var db=mongoose.connection;


module.exports = {
	verify: async function verifyUser(req, res) {
        try {
            con.db.collection('user').findOneAndUpdate({ hash: req.params.key }, { $set: { verified: true } }, function (err, collection) {
                if (err) throw err;
                    console.log("Record Verified successfully");
            })
        } catch(err) {
            console.log(err.message);
        }
    }
}