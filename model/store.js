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
    created_at: {
        type: Sequelize.DATE,
        required: true,
        allowNull: false,
        defaultValue: Sequelize.NOW
        
    },
    updated_at: {
        type: Sequelize.DATE,
        required: true,
        allowNull: false,
        defaultValue: Sequelize.NOW
    }
},{
    sequelize,
    modelName:'store',
    underscored:true
});

Store.findStores = async function(data){
    var store = this;
    var result;
    if(data['owner_id'])
        result = await store.findAll({where:{owner_id: data['owner_id']}});
    else if(data['zip'])
        result = await store.findAll({where:{zip: data['zip']}});
    else if(data['city'])
        result = await store.findAll({where:{city: data['city']}}); 
    else 
        result = await store.findAll();
  
    try {
        return new Promise((resolve, reject) => {
            if(result)
                resolve(result);
            else
                reject(new Error('Error in fetching data from database'));
        });
    }
    catch(err) {
        return Promise.reject('Database error:' + err.message);
    }
};

module.exports = {
    Store
};






