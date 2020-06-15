const { Store } = require('../model/index');
const _ = require('lodash');

exports.addStore = (req, res) => {
    const store_data  = _.pick(req.body, ['store_name','street','locality','landmark','city','state','country','zip','owner_id','open_time','close_time','is_active'])

    const store = Store.build(store_data);

    store.save().then(() => {
        var response = {
            status: 'success',
            message: 'Store successfully added'
        };
        res.send(response);
    }).catch(err => {
        var response = {
            status: 'failure',
            message: 'Failed to add store:' + err.message
        };
        res.send(response);
    });

}

exports.getStores = async (req,res) => {
    const data = _.pick(req.query, ['city','zip','owner_id']);
    console.log(data);
    var stores = [];
    try{
        if(data['owner_id'])
            stores = await Store.findStores(data);
        else if(data['zip'])
            stores = await Store.findStores(data);
        else if(data['city'])
            stores = await Store.findStores(data);
        else
            stores = await Store.findStores({});

  
        if(stores.length > 0){
            var response = {
                status: 'success',
                message: 'Store data fetched successfully',
                data: stores
            }
            res.send(response);
        }else{
            var response = {
                status: 'success',
                message: 'No store found'
            }
            res.send(response);
        }
    }
    catch(err) {
        var response = {
            status: 'failure',
            message: err.message
        }
        res.send(response);
    }
}




