const express = require("express"); // Importando a biblioteca "Express" ; 
const router = express.Router(); // Atribuindo a variável, uma instância de "Express Router" ; 
const produtosController = require("../../Controllers/admin/ProdutoController"); // Importando o controller de produtos ; 

router.get("/api/admin/produtos", produtosController.listarProdutos); // Rota responsável por exibir a página de produtos ; 
router.post("/api/admin/produtos", produtosController.adicionarProduto); // Rota responsável por adicionar um produto no banco de dados ; 
router.delete("/api/admin/produtos/:id", produtosController.deletarProduto); // Rota responsável por deletar um produto no banco de dados ; 

module.exports = router; // Exportando o router ; 