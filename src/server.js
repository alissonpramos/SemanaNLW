/**
 *criando servidor
 * preciso de modulos
 * dependencia 
 *npm init -y vai criar um package.json, transformando minha aplicação em um projeto node
 * 
 */

//criando servidor
//preciso de modulos
//dependencia 

//require > função para pegar o express e salvar na variavel "express" (parece redundante mas é isso msm que vc estar pensando yan do futuro)

//executando a função express no server
const express = require("express")
const server = express()

//pegar o banco de dados
const db = require("./database/db")

// configurar pasta publica
server.use(express.static("public"))

// habilitar o uso do req.body na nossa aplicacao
server.use(express.urlencoded({ extended: true}))

//utlizando template engine
const nunjucks = require("nunjucks")
nunjucks.configure("src/views", {
    express: server,
    noCache: true
})

// configurar caminhos da minha aplicacao
// pagina inicial
// req: requisicao
// res: resposta
server.get("/", (req, res) => {
    return res.render("index.html", {title: "título"})

})

server.get("/create-point", (req, res) => {
    return res.render("create-point.html")

})

server.post("/savepoint", (req, res) => {


    //req.body: o corpo do nosso formulario
    // console.log(req.body)

    //inserir dados no bd

    const query = `
    INSERT INTO places (
        image,
        name,
        address,
        address2,
        state,
        city,
        items
    
        ) VALUES(?,?,?,?,?,?,?);
`

    const values = [
       req.body.image,
       req.body.name,
       req.body.address,
       req.body.address2,
       req.body.state,
       req.body.city,
       req.body.items
    ]

    function afterInsertData(err) {
        if (err) {
            console.log(err)
            return res.send("erro no cadastro")
        }
        console.log("cadastrado com sucesso")
        console.log(this)
        return res.send("create-point.html", {saved: true})
    }

    db.run(query, values, afterInsertData)
    
})

server.get("/search", (req, res) => {

    const search = req.query.search

    if(search == ""){
        return res.render("search-results.html", {total: 0})
    }

  //pegar os dados do banco de dados

  db.all(`SELECT * FROM places WHERE city LIKE '%${search}%'`, function (err, rows) {
    if (err) {
        return console.log(err)
    }
    

        const total = rows.length

        // mostrar a pagina html com os dados do banco de dados
        return res.render("search-results.html", { places: rows, total: total })
    })


})



// ligar o servidor 
server.listen(3000)
