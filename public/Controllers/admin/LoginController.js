const { where } = require("sequelize"); // Importando a biblioteca "Sequelize" ; 
const Administrador = require("../../Models/Administrador"); // Importando o controller de Administrador; 
const bcrypt = require("bcryptjs"); // Importando a biblioteca "bcryptjs" para criptografia da senha;
const Loja = require("../../Models/Loja"); // Importando o model de loja ; 

// Função responsável por exibir a página de Login ; 

exports.exibirPaginaLogin = async (req, res) => {
    try {
        res.render("admin/login"); // Renderizando a página de Login ; 
    }
    catch (error) {
        console.log(error); 
    }
}