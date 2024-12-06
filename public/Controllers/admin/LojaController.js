const Loja = require("../../Models/Loja"); // Importando o model de lojas ; 
const Administrador = require("../../Models/Administrador"); // Importando o model de administrador ; 
const { where } = require("sequelize"); 

 // Função responsável por listar as lojas cadastradas no banco de dados ; 

exports.listarLojas = async (req, res) => {
    try {
        const lojas = await Loja.findAll({ // Selecionando todas as lojas do banco de dados ; 
            include: [
                { model: Administrador, attributes: ['nome'], as: 'administrador' }, 
            ]
        });

        res.render("admin/loja", { // Renderizando a página de lojas incluindo todas as lojas e administradores cadastradas no banco de dados ; 
            lojas,
            administradores: await Administrador.findAll({ raw: true }),
            errorMessage: req.session.erroMessage,
            successMessage: req.session.successMessage
        });
        deletarMensagensRequisicoes(req);
        req.session.save();
    } catch (error) {
        req.session.erroMessage = "Erro ao listar lojas"; // Atribuindo a mensagem de erro ; 
        res.redirect("/api/admin/lojas"); // Redirecionando para a página de lojas ;
    }
};

// Criando a função que será responsável por adicionar lojas ; 

exports.adicionarLoja = async (req, res) => { 
    let {nome, descricao, whatsapp, proprietario} = req.body; // Selecionando todos os campos e atribuindo a variável; 
    whatsapp = whatsapp.trim(); // Removendo os espaços no início e no fim do WhatsApp para evitar bugs;
    if(whatsapp.length !== 11) { // Caso o número seja diferente de 11 digítos (DDD + número); 
        req.session.erroMessage = "Falha ao adicionar loja! O número do WhatsApp precisa ter código de estado + número, exemplo: 831111111111"; // Atribuindo a mensagem de erro;
        return res.redirect("/api/admin/lojas"); // Redirecionando para a página de lojas;
    }
    nome = nome.trim(); // Eliminando os espaços em branco no início e no fim do nome para evitar bugs; 
    const lojaExistente = await Loja.findOne({where:{nome: nome}}); // Verificando se existe uma loja cadastrada no banco de dados com o nome informado;
    if(lojaExistente) { // Caso a loja existe; 
        req.session.erroMessage = "Já existe uma loja com o nome informado! Selecione outro nome e tente novamente"; // Atribuindo a mensagem de erro;
        return res.redirect("/api/admin/lojas"); // Redirecionando para a página de lojas ;
    }
    const administradorExistente = await Loja.findOne({where: {administradoreId: proprietario}}); // Verificando se já existe um administrador para uma loja, pois só será permitido um por loja ; 
    if(administradorExistente) { // Caso o administrador já esteja cadastrado em outra loja ; 
        req.session.erroMessage = `Falha ao adicionar loja! O administrador informado já é proprietário da loja: '${administradorExistente.nome}!'`; // Atribuindo a mensagem de erro ; 
        return res.redirect("/api/admin/lojas"); // Redirecionando para a página de lojas;
    }

    const novaLoja = await Loja.create({ // Adicionando a loja no banco de dados;
        nome, 
        descricao, 
        whatsapp: parseInt(whatsapp), 
        administradoreId: parseInt(proprietario)
    })
    req.session.successMessage = `A loja: '${novaLoja.nome}', foi adicionada com sucesso! O ID é o: ${novaLoja.id}`; // Atribuindo a mensagem de sucesso!
    res.redirect("/api/admin/lojas"); // Redirecionando para a página de lojas; 
}

// Criando a função que será responsável por excluir a loja do banco de dados ; 

exports.deletarLoja = async (req, res) => { 
    try {
        let {id} = req.params; // Recuperando o ID da loja que será excluída ; 
        const lojaExistente = await Loja.findByPk(id); // Verificando se existe uma loja com o ID informado; 
        if(!lojaExistente) { // Caso a loja não exista ; 
            req.session.erroMessage = "O ID informado para remoção da loja não é válido!"; // Atribuindo a mensagem de erro ; 
            return res.redirect("/api/admin/lojas"); // Redirecionando para a página de lojas ; 
        }
        await lojaExistente.destroy(); // Excluindo a loja do banco de dados ; 
        req.session.successMessage = `A loja: "${lojaExistente.nome}" foi excluída com sucesso!`; // Atribuindo a mensagem de sucesso ; 
        res.redirect("/api/admin/lojas"); // Redirecionando para a página de lojas ; 
    }
    catch (error) {
        req.session.erroMessage = "Erro ao excluir a loja no banco de dados"; // Atribuindo a mensagem de erro ; 
        res.redirect("/api/admin/lojas"); // Redirecionando para a página de lojas ; 
    }
}

// Criando a função que será responsável por atualizar uma loja no banco de dados ; 

exports.atualizarLoja = async (req, res) => { 
    try {
        let {id, nome, descricao, whatsapp} = req.body; // Recuperando o ID, nome, WhatsApp e descrição da loja, e atribuindo as variáveis ; 

        const lojaExistente = await Loja.findByPk(id); // Verificando se existe uma loja com o ID informado; 

        if(!lojaExistente) { // Caso a loja não exista ; 
            req.session.erroMessage = "O ID informado para edição da loja não é válido!"; // Atribuindo a mensagem de erro ; 
            return res.redirect("/api/admin/lojas"); // Redirecionando para a página de lojas ; 
        }

        whatsapp = whatsapp.trim(); // Removendo os espaços no início e no fim do WhatsApp para evitar bugs;

        if(whatsapp.length !== 11) { // Caso o número de digítos informados pelo usuário for diferente de 11(código do estado + número); 
            req.session.erroMessage = "Falha ao adicionar loja! O número do WhatsApp precisa ter código de estado + número, exemplo: 831111111111"; // Atribuindo a mensagem de erro;
            return res.redirect("/api/admin/lojas"); // Redirecionando para a página de lojas;
        }

        nome = nome.trim(); // Excluindo os espaços em brancos do início e do fim do nome; 

        const nomeAtual = lojaExistente.nome; // Nome da loja que está sendo atualizada; 
        if(nomeAtual !== nome) { // Verificando se o novo nome é diferente do nome atual;
            const nomeLoja = await Loja.findOne({where: {nome: nome}}) // Verificando se existe alguma loja com o nome informado pelo usuário ; 
            if(nomeLoja) { // Caso exista alguma loja com o nome informado pelo usuário;
                req.session.erroMessage = "Já existe uma loja com o nome informado. Escolha outro nome e tente novamente!"; // Atribuindo a mensagem de erro ; 
                return res.redirect("/api/admin/lojas"); // Redirecionando para a página de lojas ;
            }
        }

        await Loja.update({ // Atualizando a loja no banco de dados ; 
            nome, 
            descricao, 
            whatsapp: parseInt(whatsapp)
        }, {
            where: {
                id:id
            }
        })
        
        req.session.successMessage = `A loja foi atualizada com sucesso!`; // Atribuindo a mensagem de sucesso; 
        res.redirect("/api/admin/lojas"); // Redirecionando para a página de lojas ; 

    }
    catch (error) {
        req.session.erroMessage = "Erro ao atualizar a loja no banco de dados"; // Atribuindo a mensagem de erro ; 
        res.redirect("/api/admin/lojas"); // Redirecionando para a página de lojas ; 
    }
}

// FUNÇÕES AUXILIARES ; 

const deletarMensagensRequisicoes = (req) => { // Função responsável por deletar as mensagens de erro e de sucesso presente na requisição anterior ; 
    // Limpando as mensagens anteriores antes de adicionar uma nova ; 
    delete req.session.successMessage; // Limpando a mensagem de sucesso ; 
    delete req.session.erroMessage; // Limpando a mensagem de erro ; 
}
