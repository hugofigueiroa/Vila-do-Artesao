const express = require("express"); // Importando a biblioteca "Express" ; 
const app = express(); // Atribuindo a variável "app" uma instância de Express ; 
const bodyParser = require("body-parser"); // Importando a bibliteca "Body Parser" ; 
const connection = require("./public/database/database"); // Importando a conexão com o banco de dados ; 

const methodOverride = require('method-override'); // Importando o "Method-Override" para permitir que seja utilizado PUT e DELETE nos formulários ; 
app.use(methodOverride('_method')); // Utilizando o "Method-Override"

const session = require('express-session'); // Importando a biblioteca "Express-sessio" ; 

app.use(session({ // Habilitando o midleware da sessão, permitindo que dados sejam gerenciados e armazenados entre requisções; 
    secret: 'chave',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } 
}));

const path = require('path'); // Certifique-se de importar 'path' uma única vez

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// MODELS ; 

const Loja = require("./public/Models/Loja"); // Importando o model de lojas ; 

// VIEW ENGINE
app.set("view engine", "ejs"); // Definindo que a vienw engine a ser utilizada será o EJS ; 

// STATIC
app.use(express.static("public")); // Configurando o Express para servir arquivos estáticos a partir da pasta "public" ; 

// BODY PARSER
app.use(bodyParser.urlencoded({extended: false })); // Configura o middleware Body-parser para lidar com dados enviados em formulários via POST ; 
app.use(bodyParser.json()); // Configura o middleware Body-parser para lidar com dados enviados no formato JSON ; 

// DATABASE
connection.authenticate().then(() => { console.log("Conexão com o banco de dados realizada com sucesso");}).catch((error) => {console.log("Erro ao fazer conexão com o banco de dados")}); // Criando a conexão com o banco de dados ;

// ROUTERS DE ADMINISTRADOR ; 

const administradorRouter = require("./public/Routers/admin/AdministradorRouter"); // Importando o router de administradores ; 
app.use("/", administradorRouter); // Utilizando o router de administrador ; 

const lojaRouter = require("./public/Routers/admin/LojaRouter"); // Importando o router de lojas ; 
app.use("/", lojaRouter); // Utilizando o router de lojas ; 

const produtoRouter = require("./public/Routers/admin/ProdutoRouter"); // Importando o router de produtos ; 
app.use("/", produtoRouter); // Utilizando o router de lojas ; 

const loginRouter = require("./public/Routers/admin/LoginRouter"); // Importando o router de login ; 
app.use("/", loginRouter); // Utilizando o router de login ; 


// ROUTERS DE USUÁRIO ; 

const localizacaoRouterUser = require("./public/Routers/users/LocalizacaoRouter"); // Importando o router de categorias do usuário ; 
app.use("/", localizacaoRouterUser); // Utilizando o router de categorias do usuário ; 

const lojaRouterUser = require("./public/Routers/users/LojaRouterUser"); // Importando o router de lojas do usuário ; 
app.use("/", lojaRouterUser); // Utilizando o router de lojas do usuário ; 

// CRIANDO ROTAS DE HOME ; 

// USUÁRIO ; 

app.get("/api/user/home", async (req, res) => { // Rota responsável por exibir a página de HOME do usuário ; 
    try {
        res.render("user/home", {lojas: await Loja.findAll({raw:true, limit: 3})}); // Renderizando a página de home do usuário;
    }
    catch(error) {
        console.log("Erro" + error)
    }
})

// ADMINISTRADOR ; 

app.get ("/api/admin/home", async (req, res) => { // Rota responsável por exibir a página de HOME do administrador ; 
    try {
        res.render("admin/home"); // Renderizando a página de home do administrador;
    }
    catch(error) {
        console.log("Erro" + error)

    }
})

// CRIANDO O SERVIDOR
app.listen(8080, () => {console.log("Servidor rodando na porta: localhost:8080")});
