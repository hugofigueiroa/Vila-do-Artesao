const Sequelize = require("sequelize");
const connection = require("../database/database");
const Loja = require("../Models/Loja"); // Certifique-se de que o caminho está correto e o model está sendo importado corretamente

const Produto = connection.define("produtos", {
    nome: {
        type: Sequelize.STRING,
        allowNull: false
    },
    descricao: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    valor: {
        type: Sequelize.DOUBLE,
        allowNull: false
    },
    imagem1: {
        type: Sequelize.STRING,
        allowNull: false
    },
    imagem2: {
        type: Sequelize.STRING,
        allowNull: true
    },
    imagem3: {
        type: Sequelize.STRING,
        allowNull: true
    }
});

// Definindo o relacionamento dentro do arquivo
Produto.belongsTo(Loja);

Produto.sync({ force: false });

module.exports = Produto;
