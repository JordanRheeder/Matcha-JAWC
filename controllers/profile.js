const app = require('../app');
const con = require('../models/dbcon');

module.exports = {
    getUserDetails: async function getUserDetails(username) {
        // retreive session.user details from database
        // return data
        const userdata = await con.db.collection('user').findOne({ username: username }, {projection: { password: 0 }});
        // console.log(userdata);
        return (userdata);
    },

    storeUserProfilePictures: async function storeProfilePictures(image, isProfilePicture) {
        console.log(image);
    }
}