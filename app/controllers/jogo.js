

module.exports.jogo=async (application, req, res)=>{

    if(req.session.autorizado !== true){
        res.redirect('/')
        return
    }

    let msg = ''
    if(req.query.msg=='s'){
        msg='s'
    }

    
    const usuario = req.session.usuario
    const jogoDAO = new application.app.models.jogoDAO
    

    const parametros = await jogoDAO.iniciaJogo(usuario)

    res.render('jogo',{
        img_casa:req.session.casa,
        parametros,
        comandoInvalido:msg
    })
}

module.exports.sair=(application,req,res)=>{
    req.session.destroy((err)=>{
        res.render('index',{validacao:{}})
    })

}

module.exports.suditos=(application,req,res)=>{
    if(req.session.autorizado !== true){
        res.redirect('/')
        return
    }
    res.render('aldeoes',{validacao:{}})
}

module.exports.pergaminhos=async (application,req,res)=>{
    if(req.session.autorizado !== true){
        res.redirect('/')
        return
    }

    const jogoDAO = new application.app.models.jogoDAO

    const usuario=req.session.usuario
    const acoes = await jogoDAO.getAcoes(usuario)
    console.log(acoes)
    res.render('pergaminhos',{acoes})
}

module.exports.ordenar_acao_sudito=(application,req,res)=>{
    if(req.session.autorizado !== true){
        res.redirect('/')
        return
    }
    const dadosForm = req.body

    req.assert('acao','Ação deve ser informada').notEmpty()
    req.assert('quantidade','Quantidade deve ser informada').notEmpty()

    const erros = req.validationErrors()

    if(erros){
        res.redirect('jogo?msg=s')
        return
    }

    dadosForm.usuario=req.session.usuario
    const jogoDAO = new application.app.models.jogoDAO(req,res)

    jogoDAO.acao(dadosForm)

    res.redirect('jogo?msg=b')
}