const { Slot } = require('../model/index');

exports.getSlots = (req, res) => {

    Slot.getAllSlots().then((slots) => {
        var response = {
            status: 'success',
            message: 'Slots fetched successfully',
            data: slots
        }
        res.send(response);
    }).catch(err => {
        var response = {
            status: 'failure',
            message: 'Failed to fetch slots :' + err.message
        };
        res.send(response);
    })
}