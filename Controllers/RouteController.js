"use strict";
const urlp = require('url');
const Prices = require('../Models/Prices');

let EchoUtils = {

    echoGood: (res, item) => {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(Prices.getString(item));
    },

    echoBad: (res) => {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end('{"error": "Wrong path"}');
    }

};

let RouteController = {

    onRequest: (req, res) => {
        let url = urlp.parse(req.url, true);
        let path = url.pathname;
        url = url.query;

        if(path == '/get')
            EchoUtils.echoGood(res, url['item']);
        else
            EchoUtils.echoBad(res);

    },

};

module.exports = RouteController;