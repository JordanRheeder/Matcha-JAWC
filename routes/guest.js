const express = require('express');

const router = express.Router();

router.get('/', (req, res, next) => {
    res.set({
        'Access-control-Allow-Origin': '*'
    });
    return res.render('../views/generic/index.ejs', { title: 'Matcha', user: res.locals.user });
});

module.exports = router;
