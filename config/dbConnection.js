const {MongoClient} = require('mongodb')

const mongoDb = ()=>{
    const client= new MongoClient(process.env.BANCO_DE_DADOS_URI)

    const dataBase = client.db(process.env.BANCO_DE_DADOS)


    return dataBase
}

module.exports= ()=>{

    return mongoDb
}