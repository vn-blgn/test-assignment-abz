const path = require('path');

exports.createConnect = () => {
    const mysql = require('mysql2/promise');
    const pool = mysql.createPool({
        connectionLimit: 5,
        host: process.env.HOST,
        user: process.env.USER,
        database: process.env.DATABASE,
        password: process.env.PASSWORD,
        multipleStatements: true,
    });
    return pool;
};