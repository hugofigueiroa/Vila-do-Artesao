const { where } = require("sequelize"); // Importando a biblioteca "Sequelize" ; 
const Administrador = require("../../Models/Administrador"); // Importando o controller de Administrador; 
const bcrypt = require("bcryptjs"); // Importando a biblioteca "bcryptjs" para criptografia da senha;
const Loja = require("../../Models/Loja"); // Importando o model de loja ; 

// Função responsável por adicionar um administrador no banco de dados ; 

exports.adicionarAdministrador = async (req, res) => { 
    try {
        let {nome, email, senha} = req.body; // Recuperando o nome, email, e senha e atribuindo as variáveis ; 

        email = email.trim(); // Removendo os espaços do início e do fim para evitar bugs ; 
        
        const administradorExistente = await Administrador.findOne({where: {email: email}}); // Selecionando no banco de dados se existe algum administrador com o e-mail informado pelo usuário ;
        if(administradorExistente) { // Caso já exista algum administrador com o e-mail informado ;
            req.session.erroMessage = "Erro ao adicionar Administrador! Já existe um administrador com o e-mail informado!"; // Atribuindo a mensagem de erro ; 
            return res.redirect("/api/admin/administradores"); // Redirecionando para a página de administradores ;
        }

        let salt = bcrypt.genSaltSync(10); // Controlando a complexidade do hashing ; 
        let hash = bcrypt.hashSync(senha, salt); // Criando a criptografia da senha ; 

        const novoAdministrador = await Administrador.create({ // Inserindo o novo administrador no banco de dados ; 
            nome,
            email, 
            senha: hash
        })
        req.session.successMessage = `O Administrador foi adicionado com sucesso! Seu ID é o: ${novoAdministrador.id}`; // Atribuindo a mensagem de sucesso ; 
        res.redirect("/api/admin/administradores"); // Redirecionando para a página de administradores ; 
    }
    catch (error) {
        req.session.erroMessage = "Erro ao adicionar Administrador!"; // Atribuindo a mensagem de erro ; 
        res.redirect("/api/admin/administradores"); // Redirecionando para a página de administradores ; 
    }
}

// Função responsável por exibir a página de administradores ; 

exports.listarAdministradores = async (req, res) => { 
    try {
        res.render("admin/administrador", {administradores: await Administrador.findAll({raw: true}), errorMessage: req.session.erroMessage, successMessage: req.session.successMessage}); // Renderizando a página de administrador, enviando todos os administradores cadastrados no banco de dados, e enviando as mensagens de erro e de sucesso ; 
        deletarMensagensRequisicoes(req); // Deletando as mensagens salvas na requisição ; 
        req.session.save(); // Garantindo que a sessão seja salva após a deleção das mensagens salvas na requisição ; 
    }
    catch (erro) {
        req.erroMessage = "Erro ao listar administradores"; // Atribuindo a mensagem de erro ;
        res.redirect("/api/admin/administradores"); // Redirecionando para a página de administradores ; 
    }
}

// Função responsável por deletar um administrador no banco de dados ; 

exports.deletarAdministrador = async (req, res) => { 
    try {
        let id = req.params.id; // Recuperando o ID do administrador que será deletado ; 

        let administrador = await Administrador.findByPk(id); // Recuperando o administrador a ser deletado ;
   
        if(!administrador) { // Caso não exista nenhum administrador com o ID informado ; 
            req.session.erroMessage = "Erro ao deltar administrador! Não existe nenhum administrador com o ID informado!"; // Atribuindo a mensagem de erro;
            return res.redirect("/api/admin/administradores"); // Redirecionando para a página de administradores ; 
        }

        const lojaAssociada = await Loja.findOne({where: {administradoreId: id}}); // Verificando se existe lojas associadas ao administrador que está sendo excluído ; 
    
        if(lojaAssociada) {
            await lojaAssociada.destroy(); // Excluindo a loja do banco de dados ; 
        }
        
        await administrador.destroy(); // Excluindo o administrador do banco de dados ; 

        req.session.successMessage = `O administrador(a): "${administrador.nome}", foi removido com sucesso!`; // Atribuindo a mensagem de sucesso ; 
        return res.redirect("/api/admin/administradores"); // Redirecionando para a página de administradores ;
    }
    catch(erro) {
        req.session.erroMessage = "Erro ao deletar administrador! "; // Atribuindo a mensagem de erro ;
        res.redirect("/api/admin/administradores"); // Redirecionando para a página de administradores ; 
    }
}

// Função responsável por atualizar um administrador no banco de dados ; 

exports.atualizarAdministrador = async (req, res) => { 
    
    let {id, nome, email} = req.body; // Recuperando o ID, o nome, e o e-mail do administrador a ser atualizado e atribuindo as variáveis ; 

    let administrador = await Administrador.findByPk(id); // Selecionando o administrador no banco de dados;

    if(!administrador) { // Caso o administrador não exista ; 
        req.session.erroMessage = "Erro ao atualizar administrador! Não existe nenhum administrador com o ID informado"; // Atribuindo a mensagem de erro ; 
        return res.redirect("/api/admin/administradores"); // Redirecionando para a página de administradores ; 
    }

    email = email.trim(); // Removendo os espaços em branco no início e no fim do e-mail;

    const emailAtual = administrador.email; // Valor do e-mail que está sendo atualizado; 
    if(emailAtual !== email) { // Se o email atual for diferente do e-mail do administrador;
        const nomeEmail = await Administrador.findOne({where: {email: email}}); // Verificando se existe algum e-mail com o e-mail informado; 
        if(nomeEmail) { // Caso o e-mail infomado pelo usuário exista; 
            req.session.erroMessage = "Erro ao atualizar administrador! Já existe um administrador com o e-mail informado!"; // Atribuindo a mensagem de erro ; 
            return res.redirect("/api/admin/administradores"); // Redirecionando para a página de administradores;
        }   
    }

    await Administrador.update({ // Atualizando o administrador no banco de dados; 
        nome, 
        email
    }, {
        where: {
            id: id
        }
    });

    req.session.successMessage = "O administrador foi atualizado com sucesso!"; // Atribuindo a mensagem de sucesso! ;
    res.redirect("/api/admin/administradores"); // Redirecionando para a página de administradores;
}

// Funções auxiliares ; 

const deletarMensagensRequisicoes = (req) => { // Função responsável por deletar as mensagens de erro e de sucesso presente na requisição anterior ; 
    // Limpando as mensagens anteriores antes de adicionar uma nova ; 
    delete req.session.successMessage; // Limpando a mensagem de sucesso ; 
    delete req.session.erroMessage; // Limpando a mensagem de erro ; 
}

