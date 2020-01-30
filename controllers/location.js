const app = require('../app');
const con = require('../models/dbcon');
const getIP = require('external-ip')();
const ip2location = require('ip-to-location');

function distance(lat1, lon1, lat2, lon2) {
    var R = 6371; // Radius of the earth in km
    var dLat = (lat2 - lat1) * Math.PI / 180; // deg2rad below
    var dLon = (lon2 - lon1) * Math.PI / 180;
    var a =
    0.5 - Math.cos(dLat) / 2 +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    (1 - Math.cos(dLon)) / 2;  
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}




module.exports = {
    IPLocation: async function findPotentialMatches(req, res, DummyData) {
        
        let userdata = DummyData
        console.log({userdata});
        let dummyArray = new Array();

        // Can just put the data into a usertable but will get exponentially worse the more users that get queried... And if we get multiple at the same time... GG
        setTimeout(() => {
            return res.render('matches/matches.ejs', {title: 'Matches', userdata: dummyArray})
        }, 2500);
        return userdata.map(element => ip2location.fetch(element.ip)
            .then((ress, err)=>distance(req.session.user.latitude, req.session.user.longitude, ress.latitude, ress.longitude))
            .then(distance => {element.dist = Math.trunc(distance)+" km"; dummyArray.push(element); console.log({dummyArray}); return element; }) 
        )
    }
}