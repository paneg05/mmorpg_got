const {MongoClient} = require('mongodb')
const crypto =  require('crypto')


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

    gerarSenhaComSalt(senha, salt) {
        const iterations = 100;
        const keyLen = 64;
      
        return new Promise((resolve, reject) => {
          crypto.pbkdf2(senha, salt, iterations, keyLen, 'sha512', (err, derivedKey) => {
            if (err) {
              reject(err);
            } else {
              const senhaComSalt = `${salt}:${derivedKey.toString('hex')}`;
              resolve(senhaComSalt);
            }
          });
        });
      }

    async inserirUsuario (dadosUsuario){
        const dados = dadosUsuario
        const salt = crypto.randomBytes(16).toString('hex')

        const derivatedKey = await this.gerarSenhaComSalt(dadosUsuario.senha, salt).then((senha)=>{
            return senha
        })
        
        dados.senha = derivatedKey

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
        let autenticated=false
        const senha = dadosForm.senha



        const collection = this.dataBase.collection('usuarios')
        await this.connect()
        const result = await collection.findOne({nome:dadosForm.usuario})
        await this.client.close()

        const [salt, key] = result.senha.split(':')

        const derivatedKey =  await this.gerarSenhaComSalt(senha, salt).then((generatedPass)=>{
            const [salt, senha] = generatedPass.split(':')
            return senha
        })
        derivatedKey === key ? autenticated = true : autenticated = false

        if(autenticated){
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