exports.getIndex = (req, res, next) => {
    res.render('generic/index.ejs', {
        path: '/'
    });
};