"use strict";
const mysql = require('mysql');
const Config = require('../Config/config.json');

let MysqlController = {

    pool: null,

    connect: (callback) => {
        MysqlController.pool = mysql.createPool(Config.mysql);
        return callback();
    },

    query: (sql, callback) => {

        MysqlController.pool.getConnection((err, connection) => {

            if (err) {
                return callback('Error mysql connection');
            }

            connection.query({"sql": sql, "timeout": 30000}, (err, result) => {
                connection.release();
                return callback(err, result);
            });

        });

    }

};

module.exports = MysqlController;
