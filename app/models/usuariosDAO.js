const {MongoClient} = require('mongodb')



class usuariosDAO {
    constructor(req,res,dbUri){
        this.client= new MongoClient(`${process.env.BANCO_DE_DADOS_URI}`)
        this.dataBase = this.client.db(dbUri||`${process.env.BANCO_DE_DADOS}`)
        this.req=req
        this.res=res
    }


    async connect(){
        try{
            await this.client.connect()
        } catch(err){
            console.log('erro ao conectar ao banco de dados',err)
        }
    }

    async inserirUsuario (dadosUsuario){
        try{
            const collection= this.dataBase.collection('usuarios')
            await this.connect()
            await collection.insertOne(dadosUsuario)
        } catch (err) {
            console.error('erro ao inserir dados', err)
        } finally {
            await this.client.close().then(console.log('conexão com banco de dados fechada'))

        } 
      
    }
    
    async autenticar (dadosForm){

        const collection = this.dataBase.collection('usuarios')
        await this.connect()
        const result = await collection.findOne(dadosForm)
        await this.client.close()
        
        if(result){
            this.req.session.autorizado=true
            this.req.session.usuario=result.usuario
            this.req.session.casa = result.casa
            this.res.redirect('jogo')
        }else{
            this.res.render('index',{validacao:{}})
        }

        
    }
}

module.exports = ()=>{
    return usuariosDAO
}