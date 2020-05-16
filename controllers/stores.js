const { Store } = require('../model/index');
const _ = require('lodash');

exports.addStore = (req, res) => {
    const store_data  = _.pick(req.body, ['store_name','street','locality','landmark','city','state','country','zip','owner_id'])

    console.log(store_data);
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

exports.getStores = (req,res) => {
    const data = _.pick(req.query, ['city']);
    
 
    Store.findStoresByCity(data['city']).then(stores => {
     
        if(stores.length > 0){
            var response = {
                status: 'success',
                message: 'All stores in ' + data['city'] + ' fetched successfully',
                data: stores
            }
            res.send(response);
        }else{
            var response = {
                status: 'failure',
                message: 'No stores found in ' + data['city']
            }
            res.send(response);
        }
    }).catch(err => {
        var response = {
            status: 'failure',
            message: err.message
        }
        res.send(response);
    })
}




