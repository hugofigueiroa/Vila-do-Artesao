const Sequelize = require("sequelize"); // Importando a biblioteca "Sequelize" ; 
const connection = require("../database/database"); // Importando a conexão com o banco de dados ; 

const Administrador = connection.define("administradores", { // Criando a tabela de administrador ;
    nome: { // Criando o campo nome ; 
        type: Sequelize.STRING, // Definindo o tipo do campo como String ;  
        allowNull: false // Definindo que não será permitido valores nulos ; 
    } , 
    email: { // Criando o campo email ;
        type: Sequelize.STRING, // Definindo o tipo do campo como String ; 
        allowNull: false // Definindo que não será permitido valores nulos ; 
    }, 
    senha: { // Criando o campo senha ; 
        type: Sequelize.STRING, // Definindo o tipo do campo como String ; 
        allowNull: false // Definindo que não será permitido valores nulos ; 
    },
})

Administrador.sync({force: false}); // Criando a tabela no banco de dados, caso ela não exista ; 

module.exports = Administrador; // Exportando o model para ser utilizado por outros arquivos ; 