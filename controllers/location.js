const app = require('../app');
const con = require('../models/dbcon');
const getIP = require('external-ip')();
const ip2location = require('ip-to-location');
module.exports = {
    IPLocation: async function findPotentialMatches(req, res, DummyData) {
        var returnObj = new Array();
        let userdata = DummyData
        var resp = await test(userdata);
        async function test(userdata) {
            for (let key in userdata) {
                console.log(key);
                if (userdata[key] !== 'undefined' && userdata[key] != null && userdata[key] != undefined) {
                    var propValue = userdata[key];
                    if (propValue.ip && propValue.username && propValue.ip != '' && propValue.username != '' && userdata[key] && propValue) {
                        ip2location.fetch(propValue.ip, async function(err, res){
                        let theirLongitude = res.longitude;
                        let theirLatitude = res.latitude;
                        // calculate distances
                        async function distance(lat1, lon1, lat2, lon2) {
                            var R = 6371; // Radius of the earth in km
                            var dLat = (lat2 - lat1) * Math.PI / 180; // deg2rad below
                            var dLon = (lon2 - lon1) * Math.PI / 180;
                            var a =
                            0.5 - Math.cos(dLat) / 2 +
                            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                            (1 - Math.cos(dLon)) / 2;  
                            return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
                        }
                            let dist = await distance(req.session.user.latitude, req.session.user.longitude, theirLatitude, theirLongitude)
                            returnObj.push({ name: userdata[key].username, age: userdata[key].age, dist: Math.trunc(dist)+" km", gender: userdata[key].gender})
                            console.log(returnObj);
                        });
                    }
                };
            };
            console.log(JSON.stringify(resp))
            return resp;
        }
        console.log(JSON.stringify(resp))
        return resp;
    }
}