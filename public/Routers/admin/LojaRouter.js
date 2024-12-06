const express = require("express"); // Importando a biblioteca "Express" ; 
const router = express.Router(); // Atribuindo a variável, uma instância de "Express Router" ; 
const lojasController = require("../../Controllers/admin/LojaController"); // Importando o controller de lojas ; 

router.get("/api/admin/lojas", lojasController.listarLojas); // Rota responsável por exibir a página de lojas ; 
router.post("/api/admin/lojas", lojasController.adicionarLoja); // Rota responsável por adicionar uma loja no banco de dados ; 
router.delete("/api/admin/lojas/:id", lojasController.deletarLoja); // Rota responsável por deletar uma loja do banco de dados ; 
router.put("/api/admin/lojas", lojasController.atualizarLoja); // Rota responsável por atualizar uma loja no banco de dados ; 

module.exports = router; // Exportando o router ; 