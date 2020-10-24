// Requires external modules
const sqlite3   = require('sqlite3').verbose()
const path      = require('path')

var db
exports.db = db

// Connects to the DB
exports.open = (file_path) => {
    return new Promise((resolve, reject) => {
        this.db = new sqlite3.Database(file_path, sqlite3.OPEN_READONLY, (error) => {
            if (error)
                reject(`Open error: ${error.message}`)
            else
                resolve(`${path.basename(file_path, path.extname(file_path))} opened`)
        })
    })
}

// Reads the first row
exports.get = (query, params) => {
    return new Promise((resolve, reject) => {
        this.db.get(query, params, (error, row) => {
            if (error)
                reject(`Read error: ${error.message}`)
            else
                resolve(row)
        })
    }) 
}

// Reads all the row
exports.all = (query, params) => {
    return new Promise((resolve, reject) => {
        if (params == undefined)
            params = []
        this.db.all(query, params, (error, rows) => {
            if (error)
                reject(`Read error: ${error.message}`)
            else
                resolve(rows)
        })
    }) 
}

// Closes the DB
exports.close = () => {
    return new Promise((resolve, reject) => {
        this.db.close((error) => {
            if (error)
                reject(`Close error: ${error.message}`)
            else
                resolve(true)
        })
    })
}