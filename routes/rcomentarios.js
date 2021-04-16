module.exports = function(app, swig, gestorBD) {
    app.post('/comentarios/:cancion_id', function(req, res){
       let comentario  = {
           autor: req.session.usuario,
           texto: req.body.comment,
           cancion_id: gestorBD.mongo.ObjectID(req.params.cancion_id)
       }

       gestorBD.insertarComentario(comentario, function(id){
           if(id == null){
               res.redirect("/errors?mensaje=Error al insertar el comentario&tipoMensaje=alert-danger");
           }else{
               res.redirect('/cancion/' + comentario.cancion_id);
           }
       })
    });
};