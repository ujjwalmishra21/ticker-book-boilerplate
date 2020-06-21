const { Sequelize, sequelize } = require('../db/sequelize');
const { Op } = require('sequelize');
const Model = Sequelize.Model;

class Booking extends Model{};

Booking.init({
    booking_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    booking_date:{
        type: Sequelize.DATE,
        allowNull: false,
        required: true
    },
    slot_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        required: true
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
    modelName:'booking',
    underscored: true,
    timestamps: true
});

Booking.getBookingsCountForDate = async function (data){
    var booking = this;
    var count = await booking.findAll({
        attributes:['slot_id', [sequelize.fn('count', sequelize.col('booking_id')), 'slot_count']],
        where:{ store_id: data['store_id'], booking_date: data['booking_date'] },
        group:["slot_id"]
    });

    try{
        return new Promise((resolve, reject) => {
            if(count)
                resolve(count);
            else
                reject('Count not available');
            
        });

    }catch(err){
        return Promise.reject('Database error:' + err.message);
    }

}


module.exports = {
    Booking
};