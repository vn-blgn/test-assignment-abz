const { Parser } = require('json2csv');
const fs = require('fs');
const dbloader = require('./dbloader');

const users = dbloader.users(45);
const keys = [];

for (let key in users[0]) {
    keys.push(key);
};

const fields = keys;
const opts = { fields };
const myData = users;

exports.users_csv = function(id) {
    try {
        const parser = new Parser(opts);
        const csv = parser.parse(myData);
        fs.writeFileSync(`./public/files/${id}_test.csv`, csv);
        return csv;
    } catch (err) {
        console.error(err);
    }
};