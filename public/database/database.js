const Sequelize = require("sequelize"); // Importando a biblioteca "Sequelize" ; 

const connection = new Sequelize("viladoartesao", "root", "05092005hb", { // Estabelecendo a conexão com o banco de dados ; 
    host: "localhost", 
    dialect: "mysql" // Definindo o banco de dados como MySQL ; 
})

module.exports = connection ; // Exportando a conexão para ser utilizada por outros arquivos ; 