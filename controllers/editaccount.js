const mongoose = require('mongoose');

var uri = process.env.URI;
mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}); 
var db=mongoose.connection;

module.exports = {
	edit: async function editAccount(req, res) {
	// try {
		var jar = req.session.user._id;
		// console.log("Result =========>>");
		await db.collection('user').updateOne(
			{_id: jar},
			{$set: {email: "wdv1@mailinator.com"}}
			// function(err, result){
				// if (err)
					// console.log(err.message);
				// else
					// console.log(result);
			);
		// console.log("<<================");
	// } catch(err) {
		// console.log("Update failed: ");
		// console.log(err.message);
	// }
	// console.log(userInfo);
	console.log(jar);
		var varjar = await db.collection('user').findOne({_id: jar});
		console.log(varjar);
	}
}