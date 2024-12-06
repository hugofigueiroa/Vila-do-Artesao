const express = require("express"); // Importando a biblioteca "Express" ; 
const router = express.Router(); // Atribuindo a variável, uma instância de "Express Router" ; 
const localizacaoControllerUser = require("../../Controllers/user/LocalizacaoControllerUser"); // Importando o controller de localização da tela de usuários ; 

router.get("/api/user/localizacao", localizacaoControllerUser.exibirLocalizacao); // Exibindo a página de localização ; 

module.exports = router; // Exportando para ser utilizado por outros arquivos ; 