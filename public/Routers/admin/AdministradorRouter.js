const express = require("express"); // Importando a biblioteca "Express" ; 
const router = express.Router(); // Atribuindo a variável, uma instância de "Express Router" ; 
const administradorController = require("../../Controllers/admin/AdministradorController"); // Importando o controller de Administrador ; 

router.get("/api/admin/administradores", administradorController.listarAdministradores); // Criando a função que vai exibir a página de administradores ;
router.post("/api/admin/administradores", administradorController.adicionarAdministrador); // Criando a função que vai adicionar administradores ;
router.delete("/api/admin/administradores/:id", administradorController.deletarAdministrador); // Criando a função que vai deletar administradores ; 
router.put("/api/admin/administradores", administradorController.atualizarAdministrador); // Criando a função que vai atualizar administradores ;

module.exports = router; // Exportando o router para ser utilizado no arquivo principal; 