const Sequelize = require("sequelize");
const connection = require("../database/database");
const Administrador = require("./Administrador"); // Certifique-se de que o caminho está correto

const Loja = connection.define("lojas", {
    nome: {
        type: Sequelize.STRING,
        allowNull: false
    },
    descricao: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    whatsapp: {
        type: Sequelize.BIGINT,
        allowNull: false
    }
});

// Definindo o relacionamento com Administrador
Loja.belongsTo(Administrador, { foreignKey: 'administradoreId', as: 'administrador' });

Loja.sync({ force: false });

module.exports = Loja;
