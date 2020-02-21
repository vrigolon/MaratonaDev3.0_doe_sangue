const express = require("express")
const server = express()


//Config servidor para apresentar arquivos estaticos
server.use(express.static('public'))


//habilita body do formulario
server.use(express.urlencoded({ extended: true }))


//configurar conexao com banco de dados
const Pool = require('pg').Pool
const db = new Pool({
  user: 'postgres',
  password: 'postgres',
  host: 'localhost',
  port: 5432,
  database: 'doe'
})


//configura template engine
const nunjucks = require("nunjucks")
nunjucks.configure("./", {
  express: server,
  noCache: true,
})


//configurar a apresentaçao da pagina
server.get("/", function(req, res) {

  db.query("SELECT * FROM donors", function(err, result) {
    if (err) return res.send("Erro de banco de dados")
  const donors = result.rows
  return res.render("index.html", { donors })
  })
})


server.post("/", function(req, res) {
  //pegar dados do formulario
  const name = req.body.name 
  const email = req.body.email 
  const blood = req.body.blood

  if (name == "" || email == "" || blood == "") {
    return res.send("Todos os campos são obrigatórios.")
  }

  
  //colocar valores dentro do banco de dados
  const query = `
  INSERT INTO donors ("name", "email", "blood")
  VALUES ($1, $2, $3)`

  const values = [name, email, blood]

  db.query(query, values, function(err) {
    if (err) return res.send("erro no banco de dados")
    return res.redirect("/")

    })

  
})

server.listen(3000)