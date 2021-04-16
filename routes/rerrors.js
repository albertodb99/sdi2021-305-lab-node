module.exports = function(app, swig, gestorBD) {
    app.get("/errors", function(req, res) {
        let respuesta = swig.renderFile('views/error.html', { });
        res.send(respuesta);
    });

};