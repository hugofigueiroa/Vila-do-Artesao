const express = require("express"); // Importando a biblioteca "Express" ; 
const router = express.Router(); // Atribuindo a variável, uma instância de "Express Router" ; 
const logincontroller = require("../../Controllers/admin/LoginController"); // Importando o controller de login ; 

router.get("/api/login", logincontroller.exibirPaginaLogin);

module.exports = router; // Exportando o router ; 