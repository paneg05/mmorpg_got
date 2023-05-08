

module.exports.cadastro=function (application,req,res){

    res.render('cadastro',{validacao:{},dadosForm:{}})
}

module.exports.cadastrar=async(application,req,res)=>{
    const dadosForm = req.body

    req.assert('nome','Nome não pode ser vazio').notEmpty()
    req.assert('usuario','Úsuario não pode ser vazio').notEmpty()
    req.assert('senha','Senha não pode ser vazio').notEmpty()
    req.assert('casa','Casa não pode ser vazio').notEmpty()

    const erros = req.validationErrors()

    if(erros){
        res.render('cadastro',{validacao:erros,dadosForm:dadosForm})
        return
    }


    const usuariosDAO = new application.app.models.usuariosDAO
    await usuariosDAO.inserirUsuario( dadosForm)//Insere os dados no banco de dados
    
    const jogoDAO = new application.app.models.jogoDAO
    await jogoDAO.gerarParametros(dadosForm.usuario)
    res.send(dadosForm)
}