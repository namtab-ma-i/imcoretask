"use strict";
const async = require('async');
const http = require('http');
const PriceController = require('./Controllers/PriceController');
const RouteController = require('./Controllers/RouteController');
const MysqlController = require('./Controllers/MysqlController');
const Config = require('./Config/config.json');

let Application = {

    loadInterval: null,

    startService: (callback) => {
        http.createServer(RouteController.onRequest).listen(Config.application.port);

        Application.loadInterval = setInterval(() => {

            async.waterfall([

                (callback) => PriceController.load(callback),

                (callback) => PriceController.save(callback)

            ], (err) => {
                if(err)
                    console.log(err);
            });

        }, 60 * 60 * 1000); //1h

        return callback();
    },

    run: () => {

        async.waterfall([

            (callback) => PriceController.load(callback),

            (callback) => MysqlController.connect(callback),

            (callback) => PriceController.save(callback),

            (result, callback) => Application.startService(callback)

        ], (err) => {
            if(err)
                console.log(err);

            console.log('Started');
        });

    }

};

Application.run();