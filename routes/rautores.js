module.exports = function(app, swig) {
    app.get("/autores", function(req, res) {
        let autores = [{
            "nombre" : "Mortadelo",
            "grupo" : "Mortadelo y Filemón",
            "rol" : "Bajista"
        },{
            "nombre" : "Ortega y Gasset",
            "grupo" : "Dos hombres y un destino",
            "rol" : "Cantante"
        },{
            "nombre" : "Ramon y Cajal",
            "grupo" : "Somos uno, no dos",
            "rol" : "Guitarrista"
        }
        ];

        let respuesta = swig.renderFile('views/autores.html', {
            vendedor : 'Tienda de canciones',
            autores : autores
        });

        res.send(String(respuesta));
    });

    app.get('/autores/agregar', function (req, res) {
        let respuesta = swig.renderFile('views/autores-agregar.html', {});
        res.send(respuesta);
    })

    app.get('/autores/:id', function(req, res) {
        let respuesta = 'id: ' + req.params.id;
        res.send(respuesta);
    });
    app.get('/autores/:rol/:id', function(req, res) {
        let respuesta = 'id: ' + req.params.id + '<br>'
            + 'Rol: ' + req.params.genero;
        res.send(respuesta);
    });


    app.post("/autor", function(req, res) {
        let respuesta = "";

        if(typeof(req.body.nombre) != "undefined")
            respuesta += "Autor agregado:" + req.body.nombre + "<br>";
        else
            respuesta += "Autor no enviado en la petición. <br>";
        if(typeof(req.body.grupo) != "undefined")
            respuesta += "Grupo:" + req.body.grupo + "<br>";
        else
            respuesta += "Grupo no enviado en la petición. <br>";
        if(typeof(req.body.rol) != "undefined")
            respuesta += "rol:" + req.body.rol;
        else
            respuesta += "Rol no enviado en la petición.";

        res.send(respuesta);
    });

    app.get('/autores*', function (req, res) {
        res.redirect('/autores');
    })

};