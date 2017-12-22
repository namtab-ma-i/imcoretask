"use strict";
const http = require('http');
const Prices = require('../Models/Prices');
const MysqlController = require('./MysqlController');
const Config = require('../Config/config.json');

let PriceController = {

    load: (callback) => {

        http.request(Config.api, (response) => {

            let pricesData = '';

            response.on('data', (chunk) => {
                pricesData += chunk;
            });

            response.on('end', () => {
                let prices = null;

                try {
                    prices = JSON.parse(pricesData);
                }catch(e){
                    return callback('Error parsing prices')
                }

                if(!prices['success']) return callback('Error getting prices');
                Prices.set(prices);
                return callback();
            });

            response.on('error', () => {
                return callback('Http response error');
            });

        }).on('error', (error) => {
            return callback('Http request error');
        }).end();

    },

    save: (callback) => {
        let items = Prices.get();
        let query = `INSERT INTO ${Config.mysql.table} (name, safe_price, safe_net_price) VALUES `;

        let names = Object.keys(items);
        for(let i = names.length - 1; i > 0; i--) {
            let item = names[i];
            query += `("${item}", ${items[item]['safe_price']}, ${items[item]['safe_net_price']}), `;
        }

        query = query.slice(0, -2) + ' ON DUPLICATE KEY UPDATE safe_price = VALUES(safe_price), safe_net_price = VALUES(safe_net_price);';
        return MysqlController.query(query, callback);
    }

};

module.exports = PriceController;
