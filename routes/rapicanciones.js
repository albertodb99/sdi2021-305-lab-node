module.exports = function(app, gestorBD) {

    app.get("/api/cancion", function(req, res) {
        gestorBD.obtenerCanciones( {} , function(canciones) {
            if (canciones == null) {
                res.status(500);
                res.json({
                    error : "se ha producido un error"
                })
            } else {
                res.status(200);
                res.send( JSON.stringify(canciones) );
            }
        });
    });

    app.get("/api/cancion/:id", function(req, res) {
        let criterio = { "_id" : gestorBD.mongo.ObjectID(req.params.id)}

        gestorBD.obtenerCanciones(criterio,function(canciones){
            if ( canciones == null ){
                res.status(500);
                res.json({
                    error : "se ha producido un error"
                })
            } else {
                res.status(200);
                res.send( JSON.stringify(canciones[0]) );
            }
        });
    });

    //Complementario 1
    app.delete("/api/cancion/:id", function(req, res) {
        let criterio = { "_id" : gestorBD.mongo.ObjectID(req.params.id)}
        validaDatosEliminarCancion(criterio, res.usuario, function(errors){
            if (errors !== null && errors.length > 0) {
                res.status(403);
                res.json({
                    errores: errors
                })
            } else {
                gestorBD.eliminarCancion(criterio,function(canciones){
                    if ( canciones == null ){
                        res.status(500);
                        res.json({
                            error : "se ha producido un error"
                        })
                    } else {
                        res.status(200);
                        res.send( JSON.stringify(canciones) );
                    }
                });
            }
        })
    });

    //Complementario 1
    app.post("/api/cancion", function(req, res) {
        let cancion = {
            nombre : req.body.nombre,
            genero : req.body.genero,
            precio : req.body.precio,
        }
        // ¿Validar nombre, genero, precio?
        validaDatosCancion(cancion, function(errors){
            if (errors !== null && errors.length > 0) {
                res.status(403);
                res.json({
                    errores: errors
                })
            } else {
                gestorBD.insertarCancion(cancion, function (id) {
                    if (id == null) {
                        res.status(500);
                        res.json({
                            error : "se ha producido un error"
                        })
                    } else {
                        res.status(201);
                        res.json({
                            mensaje : "canción insertada",
                            _id : id
                        })
                    }
                });
            }
        })
    });

    //Complementario 1
    app.put("/api/cancion/:id", function(req, res) {

        let criterio = { "_id" : gestorBD.mongo.ObjectID(req.params.id) };

        let cancion = {}; // Solo los atributos a modificar
        if ( req.body.nombre != null)
            cancion.nombre = req.body.nombre;
        if ( req.body.genero != null)
            cancion.genero = req.body.genero;
        if ( req.body.precio != null)
            cancion.precio = req.body.precio;
        validaDatosModificarCancion(criterio, cancion, res.usuario, function(errors){
            if (errors !== null && errors.length > 0) {
                res.status(403);
                res.json({
                    errores: errors
                })
            } else {
                gestorBD.modificarCancion(criterio, cancion, function(result) {
                    if (result == null) {
                        res.status(500);
                        res.json({
                            error : "se ha producido un error"
                        })
                    } else {
                        res.status(200);
                        res.json({
                            mensaje : "canción modificada",
                            _id : req.params.id
                        })
                    }
                });
            }
        })
    });

    app.post("/api/autenticar", function(req, res){
       let seguro = app.get("crypto").createHmac('sha256', app.get('clave'))
           .update(req.body.password).digest('hex');

       let criterio = {
           email: req.body.email,
           password: seguro
       }

       gestorBD.obtenerUsuarios(criterio, function(usuarios){
          if(usuarios == null || usuarios.length == 0){
              req.status(401); //Unauthorized
              res.json({
                  autenticado : false
              })
          } else{
              let token = app.get('jwt').sign(
                  {usuario: criterio.email , tiempo: Date.now()/1000},
                  "secreto");
              res.status(200);
              res.json({
                  autenticado: true,
                  token : token
              })
          }
       });
    });

    //Complementario 1
    function validaDatosCancion(cancion, funcionCallback) {
        let errors = new Array();
        if (cancion.nombre === null || typeof cancion.nombre === 'undefined' ||
            cancion.nombre === "")
            errors.push("El nombre de la canción no puede estar vacio")
        if (cancion.genero === null || typeof cancion.genero === 'undefined' ||
            cancion.genero === "")
            errors.push("El género de la canción no puede estar vacio")
        if (cancion.precio === null || typeof cancion.precio === 'undefined' ||
            cancion.precio < 0 || cancion.precio === "")
            errors.push("El precio de la canción no puede ser negativo")
        if (errors.length <= 0)
            funcionCallback(null)
        else
            funcionCallback(errors)
    }

    //Complementario 1
    function validaDatosModificarCancion(criterio, cancion, usuario, funcionCallback) {
        let errors = new Array();
        gestorBD.obtenerCanciones(criterio, function (canciones) {
            if (canciones != null) {
                if ((canciones[0]).autor === (usuario)) {
                    if (cancion.nombre != null && (cancion.nombre.length < 3))
                        errors.push("El nombre debe tener al menos 3 caracteres")
                    if (cancion.genero != null && (cancion.genero.length < 3))
                        errors.push("El género de la canción debe tener al menos 3 caracteres")
                    if (cancion.precio != null  &&
                        (cancion.precio < 0 || cancion.precio === ""))
                        errors.push("El precio de la canción no puede ser negativo")
                    if (errors.length <= 0)
                        funcionCallback(null)
                    else
                        funcionCallback(errors)
                } else {
                    if ((canciones[0]).autor != usuario)
                        errors.push("El usuario que quiere modificar la canción no es el dueño de la misma.")
                    if (cancion.nombre != null && (cancion.nombre.length < 3))
                        errors.push("El nombre debe tener al menos 3 caracteres")
                    if (cancion.genero != null && (cancion.genero.length < 3))
                        errors.push("El género de la canción debe tener al menos 3 caracteres")
                    if (cancion.precio != null  &&
                        (cancion.precio < 0 || cancion.precio === ""))
                        errors.push("El precio de la canción no puede ser negativo")
                    if (errors.length <= 0)
                        funcionCallback(null)
                    else if(errors.length === 0)
                        funcionCallback(true);
                    else
                        funcionCallback(errors)
                }
            }
        });
    }

    //Complementario 1
    function validaDatosEliminarCancion(criterio, usuario, funcionCallback) {
        let errors = new Array();
        gestorBD.obtenerCanciones(criterio,function(canciones){
            if ( canciones != null ){
                if ((canciones[0]).autor === (usuario)) {
                    funcionCallback(true)
                } else {
                    if ((canciones[0]).autor != usuario)
                        errors.push("El usuario que quiere borrar la canción no es el dueño de la misma.")
                    if (errors.length <= 0)
                        funcionCallback(null)
                    else
                        funcionCallback(errors)
                }
            }
        });
    }

}
