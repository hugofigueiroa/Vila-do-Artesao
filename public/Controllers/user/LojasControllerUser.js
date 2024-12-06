const Loja = require("../../Models/Loja"); // Importando o Model de lojas ; 
const Administrador = require("../../Models/Administrador"); // Importando o Model de administrador ; 
const Produto = require("../../Models/Produto"); // Importando o Model de produtos ; 

exports.exibirLojas = async (req, res) => { // Função responsável por exibir as lojas cadastradas no banco de dados para o cliente ; 
    try {
        const lojas = await Loja.findAll({ // Selecionando todas as lojas do banco de dados ; 
            include: [
                { model: Administrador, attributes: ['nome'], as: 'administrador' }, 
            ]
        });
        res.render("user/loja", {
            lojas,
            administradores: await Administrador.findAll({ raw: true }),
        });   
    }
    catch (error) {
        res.redirect("/api/user/lojas"); // Redirecionando em caso de erro;
    }
}

exports.listarProdutosLojas = async (req, res) => {
    try {
        let lojaNome = req.params.loja; // Recuperando o nome da loja da requisição

        // Encontrando a loja pelo nome
        const loja = await Loja.findOne({
            where: { nome: lojaNome },
            attributes: ['id'] // Vamos precisar apenas do ID da loja para buscar os produtos
        });

        if (!loja) {
            return res.redirect("/api/user/lojas"); // Redirecionando se a loja não for encontrada
        }

        const produtos = await Produto.findAll({
            where: {
                lojaId: loja.id
            },
            include: [
                { model: Loja, attributes: ['nome'], as: 'loja' }
            ],
            attributes: ['nome', 'descricao', 'valor', 'imagem1', 'imagem2', 'imagem3']
        });

        // Renderizando a página de produtos, passando os produtos da loja
        res.render("user/produto", {
            produtos: produtos
        });
    }
    catch (error) {
        console.log("Erro ao listar os produtos cadastrados na loja! " + error);
        res.redirect("/api/user/lojas"); // Redirecionando em caso de erro
    }
};

