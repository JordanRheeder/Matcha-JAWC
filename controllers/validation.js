var usernameValidation = new RegExp('/^[a-zA-Z]+$/');

module.exports = {
	validate: async function validateRegistrationDetails(username) {
		if (username.length > 7 && username.length < 25 && usernameValidation.test(username))
			return (true);
		else
			return (false);
		// req.body.lastname,
		// req.body.email,
		// req.body.username,
		// req.body.password,
		// req.body.gender,
		// req.body.interest,
	}
}