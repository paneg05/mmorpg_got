module.exports.index=(application,req,res)=>{
    if(req.session.autorizado){
        res.redirect('jogo')
    }else{
        res.render('index',{validacao:{}})
    }
    

}

module.exports.autenticar=(application, req, res)=>{
    const dadosForm=req.body
    req.assert('usuario','Usuario não pode ser vazio !').notEmpty()
    req.assert('senha','senha não pode ser vazio !').notEmpty()

    const erros=req.validationErrors()

    if(erros){
        res.render('index',{validacao:erros})
        return
    }

    const usuariosDAO = new application.app.models.usuariosDAO(req,res)
    
    if(req.session.autorizado){
        res.redirect('jogo')

    }else{
        usuariosDAO.autenticar(dadosForm)
    }
    

}
