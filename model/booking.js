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

module.exports = {
    Booking
};