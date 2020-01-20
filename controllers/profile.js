const app = require('../app');

module.exports = {
    getUserDetails: async function getUserDetails(username) {
        // retreive session.user details from database
        // return data
        const userdata = await app.db.collection('user').findOne({ username: username }, {projection: { password: 0 }});
        // console.log(userdata);
        return (userdata);
    }
}