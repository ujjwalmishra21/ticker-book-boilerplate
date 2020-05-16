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

Store.findStoresByOwnerId = function(owner_id){
    var store = this;

    return store.findAll({
        where:{owner_id}
    }).then(stores => {
        return new Promise((resolve, reject) => {
            if(stores)
                resolve(stores);
            else
                reject(new Error('Error in fetching data from database'));
        })
    }).catch(err => {
        return Promise.reject('Database error:' + err.message);
    });
};

Store.findStoreByStoreId = function(store_id){
    var store = this;

    return store.find({
        where:{store_id}
    }).then(stores => {
        return new Promise((resolve, reject) => {
            if(stores)
                resolve(stores);
            else
                reject(new Error('Error in fetching data from database'));
        });
    }).catch(err => {
        return Promise.reject('Database error:' + err.message);
    });
};

Store.findStoresByCity = function(city){
    var store = this;

    return store.findAll({
        where:{city}
    }).then(stores => {
        return new Promise((resolve, reject) => {
            if(stores)
                resolve(stores);
            else
                reject(new Error('Error in fetching data from database'))
            
        });
    }).catch(err => {
        return Promise.reject('Database error:' + err.message);
    });
};

Store.findStoresByZip = function(zip){
    var store = this;

    return store.findAll({
        where:{zip}
    }).then(stores => {
        return new Promise((resolve, reject) => {
            if(stores)
                resolve(stores);
            else
                reject(new Error('Error in fetching data from database'));
        });
    }).catch(err => {
        return Promise.reject('Database error:' + err.message);
    });
};

Store.findStoresByOwner = function(owner_id){
    var store = this;

    return store.findAll({
        where:{owner_id}
    }).then(stores => {
        return new Promise((resolve, reject) => {
            if(stores)
                resolve(stores);
            else
                reject(new Error('Error in fetching data from database'))
            
        });
    }).catch(err => {
        return Promise.reject('Database error:' + err.message);
    });
};


module.exports = {
    Store
};






