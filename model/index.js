const { User } = require('./user');
const { Store } = require('./store');
const { Booking } = require('./booking');
const { Slot } = require('./slot');
const { Op } = require('sequelize');
//associations
Store.belongsTo(User, { foreignKey: { name: 'owner_id', allowNull: false}});
User.hasMany(Store, { foreignKey: { name: 'owner_id', allowNull: false}});

Booking.belongsTo(User, { foreignKey: { name: 'customer_id', allowNull: false}});
User.hasMany(Booking, { foreignKey: { name: 'customer_id', allowNull: false}});

Booking.belongsTo(Store, { foreignKey: { name: 'store_id', allowNull: false}});
Store.hasMany(Booking, { foreignKey: { name: 'store_id', allowNull: false}});

Booking.belongsTo(Slot, { foreignKey: { name: 'slot_id', allowNull: false}});
Slot.hasMany(Booking, { foreignKey: { name: 'slot_id', allowNull: false}});

//joins

Booking.findCustomerBookingForOwner = async function(data){

    var booking = this;
    var start_date = new Date();
    
    var start_time_f = start_date.getHours() + ':' + start_date.getMinutes() + ':' + start_date.getSeconds(); 
    try{
  
        var result = await Store.findAll({
            where: { owner_id: data['owner_id']},
            include: [{

                model: booking,
                where: {
                    booking_date: {
                        [Op.gte]: start_date.setHours(0,0,0,0)
                    },
                    is_active: 1,
                    is_complete: 0
                },
                include: [{
                    model: Slot,
                    where: {
                        [Op.and]:[
                        { is_active: 1},
                        // { 
                        //     [Op.or]: [
                        //             { start_time: { [Op.gte]: start_time_f}},
                        //             { end_time: { [Op.gte]: start_time_f }}
                        //         ]
                        // }
                    ]
                    }
                },{
                    model: User
                }]
            }]
        });

        return new Promise((resolve, reject) => {
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

Booking.findTodayCustomerBookings = async function(data){
    var booking = this;
    var start_date = new Date();
    var end_date = new Date().setHours(23,59,59,59);
    try{
        var result = await booking.findAll({
            where: {
                booking_date: {
                    [Op.between]: [start_date, end_date]    
                },
                customer_id: data['customer_id'],
                is_active: 1,
                is_complete: 0
            },
            include: [{
                model: Slot
            }]
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
                booking_date: {
                    [Op.gte]: start_date  
                },
                customer_id: data['customer_id'],
                is_active: 1,
                is_complete:0
            },
            include: [{
                model: Slot
            },{
                model: Store
            }]
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
    var start_date = new Date().setHours(0,0,0,0);
    try{
        var result = await booking.findAll({
            where: {
                booking_date: {
                    [Op.gte]: start_date  
                },
                store_id: data['store_id'],
                is_active: 1,
                is_complete: 0               
            },
            include: [{
                model: Slot
            }]
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


User.sync().then(()=>{
    console.log('users table created successfully');
    Slot.sync().then(() => {
        console.log('slots table created successfully');
        Store.sync().then(() => {
            console.log('stores table created successfully');
            Booking.sync().then(() => {
                console.log('bookings table created successfully');
            }).catch(err => {
                console.log('bookings table not created:' + err.message);
            });
        }).catch(err => {
            console.log('stores table not created:' + err.message);
        });
        
    }).catch(err => {
        console.log('slots table not created:' + err.message);
    });
  
    
}).catch(err=> {
    console.log('users table not created:' + err.message);
});

module.exports = {
    User,
    Store,
    Booking,
    Slot
}