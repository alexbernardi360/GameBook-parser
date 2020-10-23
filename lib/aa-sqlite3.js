// Requires external modules
const sqlite3   = require('sqlite3').verbose()
const path      = require('path')

var db
exports.db = db

exports.open = (file_path) => {
    return new Promise((resolve, reject) => {
        this.db = new sqlite3.Database(file_path, sqlite3.OPEN_READONLY, (err) => {
            console.log(err)
            if (err)
                reject(`Open error: ${err.message}`)
            else
                resolve(`${path.basename(file_path, path.extname(file_path))} opened`)
        })
    })
}

// any query: insert/delete/update
exports.run = (query) => {
    return new Promise((resolve, reject) => {
        this.db.run(query, (err) => {
            if  (err)
                reject(err.message)
            else
                resolve(true)
        })
    })
}

// first row read
exports.get = (query, params) => {
    return new Promise((resolve, reject) => {
        this.db.get(query, params, (err, row) => {
            if (err)
                reject(`Read error: ${err.message}`)
            else
                resolve(row)
        })
    }) 
}

// set of rows read
exports.all = (query, params) => {
    return new Promise((resolve, reject) => {
        if (params == undefined)
            params = []
        this.db.all(query, params, (err, rows) => {
            if (err)
                reject(`Read error: ${err.message}`)
            else
                resolve(rows)
        })
    }) 
}

// each row returned one by one 
exports.each = (query, params, action) => {
    return new Promise((resolve, reject) => {
        var db = this.db
        db.serialize(() => {
            db.each(query, params, (err, row) => {
                if (err)
                    reject(`Read error: ${err.message}`)
                else if(row)
                    action(row)
            })
            db.get("", (err, row) => {
                resolve(true)
            })
        })
    })
}

exports.close = () => {
    return new Promise((resolve, reject) => {
        this.db.close()
        resolve(true)
    })
}