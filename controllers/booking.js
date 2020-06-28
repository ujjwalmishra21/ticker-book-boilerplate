const { Booking } = require('../model/index');
const _ = require('lodash');
const QRCode = require('qrcode');
const bcrypt = require('bcryptjs');

exports.createBooking = async (req, res) => {
    var data = _.pick(req.body, ['booking_date', 'store_id', 'customer_id', 'slot_id', 'max_slot_count']);
    var slot_time = new Date(data['booking_date']).toISOString();
       
    data['booking_date'] = slot_time;

    var count_object = {
        'booking_date': slot_time,
        'store_id': data['store_id'],
        'slot_id': data['slot_id'],
    };
    try{
        var slot_info = await Booking.getBookingsCountForSlot(count_object);
     
        if(slot_info.dataValues['slot_count'] < data['max_slot_count']){
            
            var booking_code = Math.random().toString(36).substr(2);
            // var salt = await bcrypt.genSalt(10);
            
            // var booking_code_hash = await bcrypt.hash(booking_code, salt);

            data['booking_code'] = booking_code;
            
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

        }else{

            var response = {
                status:'failure',
                message: 'The slot is full. Please select other slot.'
            };
            res.send(response);
        }
    }catch(err){
        var response = {
            status:'failure',
            message: err.message
        }
        res.send(response);
    }
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
                status: 'success',
                message: 'No booking found'
            };
            res.send(response);
        }
    }
    catch(err) {
       
        var response = {
            status: 'failure',
            message: err.message
        };
        res.send(response);
    }
};

exports.getBookingsCountForDate = async (req, res) => {
    const data = _.pick(req.query, ['booking_date', 'store_id']);

    var booking_count = [];
    data['booking_date'] = new Date(decodeURIComponent(data['booking_date'])).toISOString();
    
    try{
        if(data['booking_date'] && data['store_id']){
            booking_count = await Booking.getBookingsCountForDate(data);
            var response = {
                status: 'success',
                message: 'Bookings count data fetched successfully',
                data: booking_count
            };
            res.send(response);
        }else{
            var response = {
                status: 'success',
                message: 'No booking count data found',
                data: []
            };
            res.send(response);

        }
    }catch(err){
        var response = {
            status: 'failure',
            message: err.message
        }
        res.send(response);
    }
};


exports.getQRCode = async (req, res) => {
    const data = _.pick(req.query, ['booking_id']);

    try{

        var qr_code = await Booking.getQRImageStr(data);
        if(qr_code){
            var response = {
                status: 'success',
                message: 'QR Code fetched successfully',
                data: qr_code
            }
            res.send(response);
        }else{
            var response = {
                status: 'failure',
                message: 'Error in generating QR Code'
            }
            res.send(response);
        }   

    }catch(err){
        var response = {
            status: 'failure',
            message: err.message
        };
        res.send(response);
    }

};


exports.completeBookingVerification = async (req, res) => {

    const data = _.pick(req.body, ['qr_data']);
    
    if(data){
        try{
            
            const data_split = data['qr_data'].split(' ');
           
            const completion_object = {
                'booking_code': data_split[0],
                'customer_id': data_split[1],
                'booking_id': data_split[2]                
            };

            const booking_completion = await Booking.completeBookingVerification(completion_object);
            if(booking_completion){
                var response = {
                    status: 'success',
                    message: 'User booking verified successfully'
                };
                res.send(response);

            }else{
                var response = {
                    status: 'failure',
                    message: 'Invalid QR Code'
                };
                res.send(response);
            }

        }catch(err){

            var response = {
                status:'failure',
                message: err.message
            };
            res.send(response);

        }


    }else{
        
        var response = {
            status: 'failure',
            message:'QR data cannot be empty'
        };
        res.send(response);
    }
}