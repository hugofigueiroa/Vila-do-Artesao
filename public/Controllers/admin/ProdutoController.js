const Produto = require("../../Models/Produto"); // Importando o model de produtos ; 
const Loja = require("../../Models/Loja"); // Importando o model de Lojas ; 

// CONFIGURANDO O MULTER PARA LIDAR COM AS IMAGENS
const multer = require('multer'); // Importando o "multer" ; 
const path = require('path'); // Importando o "path" ; 
const fs = require('fs'); // Importando o módulo fs ; 


const storage = multer.diskStorage({ // Configuração do storage para salvar as imagens na pasta correta
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../../uploads')); // Definindo o caminho da pasta de upload
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '-' + file.originalname); // Nome único para cada imagem
    }
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 2 * 1024 * 1024 
    },
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

        if (mimetype && extname) {
            return cb(null, true);
        }

        req.session.erroMessage = "Erro ao adicionar produto! Apenas imagens JPEG e PNG são permitidas.";
        return cb(new Error("Arquivo inválido"));
    }
});

// Função para listar os produtos no banco de dados ; 

exports.listarProdutos = async (req, res) => {
    try {
        const produtos = await Produto.findAll({ // Selecionando todos os produtos cadastrados no banco de dados ; 
            include: [
                { model: Loja, attributes: ['nome'], as: 'loja'}
            ]
        });
        res.render("admin/produto", { // Renderizando a página de produtos incluindo as lojas cadastradas no banco de dados ; 
            produtos, 
            lojas: await Loja.findAll({ raw: true }), 
            errorMessage: req.session.erroMessage,
            successMessage: req.session.successMessage
        });
        deletarMensagensRequisicoes(req);
        req.session.save();
    } catch (error) {
        req.session.erroMessage = "Erro ao listar os produtos cadastrados no banco de dados"; // Atribuindo a mensagem de erro ; 
        res.redirect("/api/admin/produtos"); // Redirecionando para a página de produtos ; 
    }
};

// Função para adicionar produto ao banco de dados

exports.adicionarProduto = async (req, res) => {
    upload.fields([{ name: 'imagem1' }, { name: 'imagem2' }, { name: 'imagem3' }])(req, res, async (err) => {
        if (err) {
            console.log(err)
            req.session.erroMessage = err.message;
            return res.redirect("/api/admin/produtos");
        }
        const { nome, descricao, valor, lojaId } = req.body;
        try {
            const imagem1 = req.files['imagem1'] ? req.files['imagem1'][0].filename : null;
            const imagem2 = req.files['imagem2'] ? req.files['imagem2'][0].filename : null;
            const imagem3 = req.files['imagem3'] ? req.files['imagem3'][0].filename : null;
            
            if (!imagem1) {
                req.session.erroMessage = "Falha ao adicionar produto! O produto precisa ter ao menos uma imagem.";
                return res.redirect("/api/admin/produtos");
            }

            const produtoNovo = await Produto.create({
                nome, 
                descricao, 
                valor, 
                imagem1, 
                imagem2, 
                imagem3, 
                lojaId
            });
        
            req.session.successMessage = `O produto: "${produtoNovo.nome}", foi adicionado com sucesso! Seu ID é o: ${produtoNovo.id}`;
            res.redirect("/api/admin/produtos");
        } catch (erro) {
            req.session.erroMessage = "Erro ao adicionar produto! " + erro;
            res.redirect("/api/admin/produtos");
        }
    });
};

exports.deletarProduto = async (req, res) => {
    try {
        let id = req.params.id; // Recuperando o ID do produto a ser removido

        const produto = await Produto.findByPk(id); // Selecionando o produto no banco de dados para verificar se ele existe

        if (!produto) { // Verificando se o produto existe
            req.session.erroMessage = "Erro ao deletar o produto! O ID informado não é válido!"; // Atribuindo a mensagem de erro ; 
            return res.redirect("/api/admin/produtos"); // Redirecionando para a página de produtos ; 
        }

        // Definindo os caminhos das imagens
        const imagePaths = [
            path.join(__dirname, '..', '..', 'uploads', produto.imagem1), // Imagem principal ; 
            produto.imagem2 ? path.join(__dirname, '..', '..', 'uploads', produto.imagem2) : null, // Segunda imagem (caso exista) ; 
            produto.imagem3 ? path.join(__dirname, '..', '..', 'uploads', produto.imagem3) : null // Terceira imagem (caso exista) ; 
        ];


        for (const imagePath of imagePaths) { // Removendo as imagens ; 
            if (imagePath && fs.existsSync(imagePath)) { // Verificando se a imagem existe ; 
                fs.unlinkSync(imagePath); // Apagando a imagem ; 
            } 
        }

        await produto.destroy(); // Excluindo o produto no banco de dados

        req.session.successMessage = `O produto: ${produto.nome}, foi excluído com sucesso!`; // Atribuindo a mensagem de sucesso! ; 
        res.redirect("/api/admin/produtos"); // Redirecionando para a página de produtos ;
    } catch (erro) {
        req.session.erroMessage = "Falha ao deletar o produto no banco de dados!"; // Atribuindo a mensagem de erro ; 
        res.redirect("/api/admin/produtos"); // Redirecionando para a página de produtos ; 
    }
};

// Função auxiliar para deletar mensagens de erro/sucesso das requisições anteriores
const deletarMensagensRequisicoes = (req) => {
    delete req.session.successMessage;
    delete req.session.erroMessage;
};
