require('dotenv').config();
const mysql = require('mysql');
const data = require('./data');

function db_conn() {
    const connection = mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    });

    connection.connect((err) => {
        if (err) {
            console.error('Error connecting: ' + err.stack);
            return;
        }
        // console.log('Connected as id ' + connection.threadId);
    });
    return connection;
}


function saveCountry(countryCode, countryName, con = "") {
    return new Promise((resolve, reject) => {
        if (con == "") {
            con = db_conn();
        }
        let query = 'INSERT INTO countries(countryCode, countryName) VALUES (?,?)';
        let values = [countryCode, countryName];
        con.query(query, values, (err, results) => {
            if (err) {
                return reject({
                    "status": -1,
                    "message": err
                });
            }
            resolve({
                "status": 1,
                "cid": results.insertId
            })
        });
    });
}

function saveToSingleColumn(column, value, cid) {
    return new Promise((resolve, reject) => {
        const con = db_conn();
        let query = `UPDATE countries SET ${column}=? WHERE cid=?`;
        let values = [value, cid];
        con.query(query, values, (err, results) => {
            if (err) {
                return reject({
                    "status": -1,
                    "message": err
                });
            }
            resolve({
                "status": 1,
                "results": results
            })
        });
    });
}

function pullContinentData(countryCode) {
    return new Promise((resolve, reject) => {
        const con = db_conn();
        let query = 'SELECT * FROM world WHERE continent_id=? LIMIT 1';
        let values = [countryCode];
        con.query(query, values, (err, results) => {
            if (err) {
                return reject({
                    "status": -1,
                    "message": err
                });
            }
            if (results.length == 0) {
                return reject({
                    "status": -1,
                    "message": "Country does not exist"
                });
            }
            results.forEach((row) => {                
                return resolve({
                    "status": 1,
                    'continent_id': row.continent_id,
                    'prevelence_1': row.prevelence_1,
                    'prevelence_2': row.prevelence_2,
                    'urban': row.urban,
                    'population': row.population,
                    'data_availablity': row.data_availablity,
                    'myopiaPercentage': row.myopiaPercentage,
                    'rural': row.rural,
                    'prevelence_3': row.prevelence_3
                });
            });
        });
    });
}

function pullMyopiaValues() {
    return new Promise((resolve, reject) => {
        const sendBack = [];
        const con = db_conn();
        let query = 'SELECT * FROM world';
        let values = [-1, ''];
        con.query(query, values, (err, results) => {
            if (err) {
                return reject({
                    "status": -1,
                    "message": err
                });
            }
            if (results.length == 0) {
                return reject({
                    "status": -1,
                    "message": "No data"
                });
            }
            results.forEach((row) => {
                sendBack.push({
                    'cid': row.cid,
                    'continent_id': row.continent_id,
                    'countryCode': row.countryCode,
                    'myopiaPercentage': row.myopiaPercentage,
                })
            });
            return resolve({
                "status": 1,
                'data': sendBack
            });
        });
    });
}


function savePopulationData(countryCode, countryName, con = "") {
    if (con == "") {
        con = db_conn();
    }
    return new Promise((resolve, reject) => {
        let query = 'INSERT INTO countries(countryCode, countryName) VALUES (?,?)';
        let values = [countryCode, countryName];
        con.query(query, values, (err, results) => {
            if (err) {
                return reject({
                    "status": -1,
                    "message": err
                });
            }
            resolve({
                "status": 1
            })
        });
    });
}

function checkCountryCode(countryCode) {
    return new Promise((resolve, reject) => {
        const con = db_conn();
        let query = 'SELECT * FROM countries WHERE countryCode=? LIMIT 1';
        let values = [countryCode];
        con.query(query, values, (err, results) => {
            if (err) {
                return reject({
                    "status": -1,
                    "message": err
                });
            }
            if (results.length == 0) {
                return reject({
                    "status": -1,
                    "message": "Country does not exist"
                });
            }
            results.forEach((row) => {
                return resolve({
                    "status": 1,
                    'cid': row.cid
                });
            });
        });
    });
}

async function initCountrySave() {
    const con = db_conn();
    let countriesAddedSuccesfully = countriesFailed = 0;
    for (let index = 0; index < data.countriesArray.length; index++) {
        const element = data.countriesArray[index];
        const result = await saveCountry(element.code, element.name, con);
        if (result.status == -1) {
            countriesFailed += 1
        } else {
            countriesAddedSuccesfully += 1
        }
    }
    console.log(`Summary\nTotal countries: ${data.countriesArray.length}.\nCountries added successfully: ${countriesAddedSuccesfully}\nCountires failed: ${countriesFailed}`);

}


module.exports = {
    checkCountryCode,
    saveCountry,
    saveToSingleColumn,
    pullContinentData,
    pullMyopiaValues,
    
};


function insertFakeData() {
    return new Promise((resolve, reject) => {
        const sendBack = [];
        const con = db_conn();
        let query = 'UPDATE countries FROM world';
        let values = [-1, ''];
        con.query(query, values, (err, results) => {
            if (err) {
                return reject({
                    "status": -1,
                    "message": err
                });
            }
            if (results.length == 0) {
                return reject({
                    "status": -1,
                    "message": "No data"
                });
            }
            results.forEach((row) => {
                sendBack.push({
                    'cid': row.cid,
                    'continent_id': row.continent_id,
                    'countryCode': row.countryCode,
                    'myopiaPercentage': row.myopiaPercentage,
                })
            });
            return resolve({
                "status": 1,
                'data': sendBack
            });
        });
    });
}





