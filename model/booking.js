const { Sequelize, sequelize } = require('../db/sequelize');
const { Op } = sequelize
const Model = Sequelize.Model;

class Booking extends Model{};

Booking.init({
    booking_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    slot_time: {
        type: Sequelize.DATE,
        allowNull: false,
        required: true
    },
    is_active: {
        type: Sequelize.INTEGER,
        allowNull: false,
        required: true,
        is:/^[01]$/,
        defaultValue: 1
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
    modelName:'booking',
    underscored: true
});


Booking.findTodayCustomerBookings = async function(data){
    var booking = this;
    var start_date = new Date();
    var end_date = new Date(start_date.getTime() + 24*60*60*1000);
    try{
        var result = await booking.findAll({
            where: {
                slot_time: {
                    [Op.between]: [start_date, end_date]    
                },
                customer_id: data['customer_id'],
                is_active: 1
            }
        });

   
        return new Promise((resolve,reject) => {
            if(result)
                resolve(result);
            else
                reject(new Error('No data found'));
        });
    }
    catch(err){
        return Promise.reject('Database error:' + err.message);
    }

}

Booking.findAllCustomerBookings = async function(data){
    var booking = this;
    var start_date = new Date();
    try{
        var result = await booking.findAll({
            where: {
                slot_time: {
                    [Op.gte]: start_date  
                },
                customer_id: data['customer_id'],
                is_active: 1
            }
        });

    
        return new Promise((resolve,reject) => {
            if(result)
                resolve(result);
            else
                reject(new Error('No data found'));
        });
    }
    catch(err){
        return Promise.reject('Database error:' + err.message);
    }

}

Booking.findStoreBookings = async function(data){
    var booking = this;
    var start_date = new Date();
    try{
        var result = await booking.findAll({
            where: {
                slot_time: {
                    [Op.gte]: start_date  
                },
                store_id: data['store_id'],
                is_active: 1
            }
        });

  
        return new Promise((resolve,reject) => {
            if(result)
                resolve(result);
            else
                reject(new Error('No data found'));
        });
    }
    catch(err){
        return Promise.reject('Database error:' + err.message);
    }

}

module.exports = {
    Booking
};