const { User } = require('./user');
const { Store } = require('./store');
const { Booking } = require('./booking');
const { Op } = require('sequelize');
//associations
Store.belongsTo(User, { foreignKey: { name: 'owner_id', allowNull: false}});
User.hasMany(Store, { foreignKey: { name: 'owner_id', allowNull: false}});

Booking.belongsTo(User, { foreignKey: { name: 'customer_id', allowNull: false}});
User.hasMany(Booking, { foreignKey: { name: 'customer_id', allowNull: false}});

Booking.belongsTo(Store, { foreignKey: { name: 'store_id', allowNull: false}});
Store.hasMany(Booking, { foreignKey: { name: 'store_id', allowNull: false}});



//joins

Booking.findCustomerBookingForOwner = async function(data){

    var booking = this;
    var start_date = new Date();
    try{
        var result = await Store.findAll({
            where: { owner_id: data['owner_id']},
            include: [{
                model: booking,
                where: {
                    slot_time: {
                        [Op.gte]: start_date
                    },
                    is_active: 1
                }
            }]
        });

        return new Promise((resolve, reject) => {
            if(result)
                resolve(result);
            else
                reject(new Error('No data found'));
        })
    }
    catch(err){
        return Promise.reject('Database error:' + err.message);
    }

}




User.sync().then(()=>{
    console.log('users table created successfully');
}).catch(err=> {
    console.log('users table not created:' + err.message);
});

Store.sync().then(() => {
    console.log('stores table created successfully');
}).catch(err => {
    console.log('stores table not created:' + err.message);
})

Booking.sync().then(() => {
    console.log('bookings table created successfully');
}).catch(err => {
    console.log('bookings table not created:' + err.message);
})

module.exports = {
    User,
    Store,
    Booking
}