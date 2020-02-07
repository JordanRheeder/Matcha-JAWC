const app = require('../app');
const con = require('../models/dbcon');
const fs = require('fs');

module.exports = {
    getUserDetails: async function getUserDetails(username) {
        // retreive session.user details from database
        // return data
        const userdata = await con.db.collection('user').findOne({ username: username }, {projection: { password: 0 }});
        // console.log(userdata.profilePicture);
        return (userdata);
    },

    // convertImageToBase64: async function convertImage(file) {
    //     const reader = new FileReader();
    //     reader.readAsDataURL(file);
    //     reader.onload = function () {
    //         console.log(reader.result);
    //         return (reader.result);
    //     };
    //     reader.onerror = function (error) {
    //         console.log('Error: ', error);
    //     };
    // },

    storeUserProfilePictures: async function storeProfilePictures(req, res, isProfilePicture) {

        // base64String = await this.convertImageToBase64(req.body.image);

        // console.log(req.body.image);

        if (isProfilePicture !== 0) {
            await con.db.collection('user').updateOne({hash: req.session.user.hash}, {$set: {profilePicture: req.body.image}}, {upsert: true});
            req.session.user.profilePicture = req.body.image;
            console.log('Inserted Profile image in user.profilePicture.');
            res.redirect('/profile');
        } else if (isProfilePicture === 0) {
            var pictureCount = await con.db.collection('images').count({hash: req.session.user.hash});
            if (pictureCount < 5)
                await con.db.collection('images').insertOne({hash: req.session.user.hash}, { $set: {image: req.body.image,
                    userHash: req.session.user.hash, profilePicture: false}});
            // else
            //     return err msg
            console.log('Inserted Profile image in matcha.profilePicture.');
            res.redirect('/profile');
        }
    },
}