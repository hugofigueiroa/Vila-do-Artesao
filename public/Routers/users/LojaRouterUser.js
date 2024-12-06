const express = require("express"); // Importando a biblioteca "Express" ; 
const router = express.Router(); // Atribuindo a variável, uma instância de "Express Router" ; 
const lojasControllerUser = require("../../Controllers/user/LojasControllerUser"); // Importando o controller de lojas do usuário ; 

router.get("/api/user/lojas", lojasControllerUser.exibirLojas); // Exibindo a página de lojas ; 
router.get("/api/user/lojas/:loja", lojasControllerUser.listarProdutosLojas); // Exibindo a página de produtos vinculados a uma loja ; 

module.exports = router; // Exportando para ser utilizado por outros arquivos ; 