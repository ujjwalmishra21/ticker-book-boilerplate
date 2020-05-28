const { Sequelize, sequelize } = require('../db/sequelize');

const Model = Sequelize.Model;

class Slot extends Model{};

Slot.init({
    slot_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    start_time: {
        type: Sequelize.TIME,
        required: true,
        allowNull: false
    },
    end_time:{
        type: Sequelize.TIME,
        required: true,
        allowNull: false
    },
    description:{
        type: Sequelize.STRING,
        required: true,
        allowNull: false
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
    modelName: 'slot',
    underscored: true
});

Slot.getAllSlots = async function() {
    var slot = this;
    var slots = await slot.findAll({ where: { is_active: 1 }});

    try{
        return new Promise((resolve, reject) => {
            if(slots)
                resolve(slots);
            else
                reject(new Error('Error in fetching data from database'));
        });

    }catch(err){
        return Promise.reject('Database error:' + err.message);
    }
};

module.exports = {
    Slot
};