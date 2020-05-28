const { Booking } = require('../model/index');
const _ = require('lodash');

exports.createBooking = (req, res) => {
    var data = _.pick(req.body, ['booking_date', 'store_id', 'customer_id', 'slot_id']);
    var slot_time = new Date(data['booking_date']).toISOString();
       
    data['booking_date'] = slot_time;
   
    const booking = Booking.build(data);
    
    booking.save().then(() => {
        var response = {
            status: 'success',
            message: 'Booking created successfully'
        };
        res.send(response);

    }).catch(err => {
        var response = {
            status: 'failure',
            message: err.message
        };
        res.send(response);
    });
};

exports.getBooking = async (req, res) => {
    const data = _.pick(req.query, ['customer_id', 'owner_id']);
    
    var bookings = [];
    try{
        if(data['customer_id'])
            bookings = await Booking.findAllCustomerBookings(data);
        else if(data['owner_id'])
            bookings = await Booking.findCustomerBookingForOwner(data);
        
        if(bookings.length > 0){
            var response = {
                status: 'success',
                message: 'Booking data fetched successfully',
                data: bookings
            };
            res.send(response);
        }else{
            var response = {
                status: 'failure',
                message: 'No booking found'
            };
            res.send(response);
        }
    }
    catch(err) {
        console.log(err);
        var response = {
            status: 'failure',
            message: err.message
        };
        res.send(response);
    }
};






