module.exports= {
	food: async() => {
		var validation = require('./validation.js');
		var ret = validation.validate("1234");
		console.log(ret);
}};

food();