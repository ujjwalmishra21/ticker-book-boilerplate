const { Sequelize, sequelize } = require('../db/sequelize');

const Model = Sequelize.Model;

class Store extends Model {};

Store.init({
    store_id:{
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    store_name:{
        type: Sequelize.STRING,
        required: true,
        allowNull: false
    },
    street:{
        type: Sequelize.STRING,
        required: true,
        allowNull: false
    },
    locality:{
        type: Sequelize.STRING,
        required: true,
        allowNull: false
    },
    landmark: Sequelize.STRING,
    city:{
        type: Sequelize.STRING,
        required: true,
        allowNull: false
    },
    state: {
        type: Sequelize.STRING,
        required: true,
        allowNull: false
    },
    country: {
        type: Sequelize.STRING,
        allowNull: false
    },
    zip:{
        type: Sequelize.INTEGER,
        required: true,
        allowNull: false,
        is: /^[1-9]\d{5}$/g,
    },
    open_time:{
        type: Sequelize.TIME
    },
    close_time:{
        type: Sequelize.TIME
    },
    is_active: {
        type: Sequelize.INTEGER,
        allowNull: false,
        required: true,
        is:/^[01]$/,
        defaultValue: 1
    }
},{
    sequelize,
    modelName:'store',
    underscored:true,
    timestamps: true
});

module.exports = {
    Store
};






