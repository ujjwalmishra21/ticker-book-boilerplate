const { Sequelize, sequelize } = require('../db/sequelize');
const { Op } = require('sequelize');
const QRCode = require('qrcode');
const bcrypt = require('bcryptjs');

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
    },
    is_complete:{
        type: Sequelize.INTEGER,
        allowNull: false,
        is:/^[01]$/,
        defaultValue: 0
    },
    booking_code:{
        type: Sequelize.STRING,
        allowNull: false,
        required: true

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
        where:{ store_id: data['store_id'], booking_date: data['booking_date'], is_complete: 0 },
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

Booking.getBookingsCountForSlot = async function (data){
    var booking = this;
    var count = await booking.findOne({
        attributes:['slot_id', [sequelize.fn('count', sequelize.col('booking_id')), 'slot_count']],
        where:{ store_id: data['store_id'], slot_id: data['slot_id'], booking_date: data['booking_date'], is_complete: 0 }
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


Booking.getQRImageStr = async function (data){
    var booking = this;
    
    var booking_data = await booking.findOne({
        attributes: ['booking_code', 'customer_id'],
        where:{ booking_id: data['booking_id'], is_complete: 0}
    });

    var qr_image_string = '';
    
    try{
        if(booking_data['booking_code'] && booking_data['customer_id'] && data['booking_id'])
            qr_image_string = await QRCode.toDataURL(booking_data['booking_code'] + " " + booking_data['customer_id'] + " " + data['booking_id']);
        else
        return Promise.reject('Error in getting QR Code');
        
    }catch (err) {
        console.log(err)
        return Promise.reject('Error in getting QR Code');
    }
    
    try{
        return new Promise((resolve, reject) => {
            if(qr_image_string)
                resolve(qr_image_string);
            else
                reject('QR Code not available');
            
        });

    }catch(err){
        return Promise.reject('Database error:' + err.message);
    }

}

Booking.completeBookingVerification = async function(data, ){
    var booking = this;

    var booking_data = '';
    var match_result = '';
   
    try{
        booking_data = await booking.findOne({
            attributes: ['booking_code'],
            where:{ booking_id: data['booking_id'], customer_id: data['customer_id'], is_complete: 0 }
        });
        
        if(!booking_data)
            return Promise.reject('Invalid QR Code');
       
        // match_result = await bcrypt.compare(data['booking_code'], booking_data.booking_code);
        match_result = (data['booking_code'] === booking_data.booking_code);

        if(!match_result)
            return Promise.reject('Invalid QR Code');

        var update_rec = await booking.findOne({where: { booking_id: data['booking_id']}});
        update_rec.is_complete = 1;
        await update_rec.save();

        return new Promise((resolve, reject) => {
            if(update_rec)
                resolve(update_rec);
            else
                reject(new Error('Invalid QR Code'));
        });

    }catch(err){
        return Promise.reject('Invalid QR Code');
    }
}


module.exports = {
    Booking
};