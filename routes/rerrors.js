module.exports = function(app, swig, gestorBD) {
    app.get("/errors", function(req, res) {
        let respuesta = swig.renderFile('views/error.html', { errors: req.session.errors});
        res.send(respuesta);
        req.session.errors = [];
    });

};