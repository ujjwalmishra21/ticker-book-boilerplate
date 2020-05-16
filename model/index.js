const { User } = require('./user');
const { Store } = require('./store');


//associations
Store.belongsTo(User, { foreignKey: {name:'owner_id', allowNull: false}});
User.hasMany(Store, { foreignKey: {name:'owner_id', allowNull: false}});



User.sync().then(()=>{
    console.log("users table created successfully");
}).catch(err=> {
    console.log("users table not created:" + err.message);
});

Store.sync().then(() => {
    console.log('store table created successfully');
}).catch(err => {
    console.log('store table not created:' + err.message);
})



module.exports = {
    User,
    Store
}