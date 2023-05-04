const {MongoClient} = require('mongodb')

class jogoDAO{
    constructor(req,res,dbUri){
        this.client= new MongoClient(`${process.env.BANCO_DE_DADOS_URI}`)
        this.dataBase = this.client.db(dbUri||`${process.env.BANCO_DE_DADOS}`)
        this.req=req
        this.res=res
    }

    async gerarParametros (usuario){
        try{
            const collection= this.dataBase.collection('jogo')
            await this.client.connect()
            await collection.insertOne({
                usuario: usuario,
                moedas: 15,
                suditos: 10,
                temor: Math.round(Math.random()*1000),
                sabedoria: Math.round(Math.random()*1000),
                comercio: Math.round(Math.random()*1000),
                magia: Math.round(Math.random()*1000)
            })
        } catch (err) {
            console.error('erro ao inserir dados', err)
        } finally {
            await this.client.close()
        }
    }

    async iniciaJogo(usuario){
        const collection = this.dataBase.collection('jogo')
        await this.client.connect()
        const result = await collection.findOne({usuario:usuario})
        await this.client.close()
        
        return result
    }

    async acao(acao){
        const date = new Date()
        const tempo = null

        switch(parseInt(acao.acao)){
            case 1: tempo = 1 * 60 * 60000;
                break
            case 2: tempo = 2 * 60 * 60000;
                break
            case 3: tempo = 5 * 60 * 60000;
                break
            case 4: tempo = 5 * 60 * 60000;
                break
        }

        acao.terminaEm= date.getTime() + tempo

        try{
            const collection= this.dataBase.collection('acao')
            await this.client.connect()
            await collection.insertOne(acao)
        } catch (err) {
            console.error('erro ao inserir dados', err)
        } finally {
            await this.client.close()
        }
    }

    async getAcoes(usuario){
        try{
            const collection= this.dataBase.collection('acao')
            await this.client.connect()
            const result = await collection.find({usuario}).toArray((err, results)=>{
                return results
            })
            await this.client.close()
            return result
            
        } catch (err) {
            console.error('erro ao inserir dados', err)
        } finally {
            
        }

        
    }
}





module.exports = function(){
    return jogoDAO
}