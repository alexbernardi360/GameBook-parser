// Requires imported modules
const path      = require('path')
const sqlite3   = require('sqlite3').verbose()

// Requires internal modules
const lib       = require('./lib')

// Get the path of the SQLite file from command line arguments.
var path_file = process.argv[2]

if (!path.isAbsolute(path_file))
    path_file = `./${path_file}`

var title = path.basename(path_file, path.extname(path_file))

// Connects to SQLite DB
let db = new sqlite3.Database(path_file, sqlite3.OPEN_READONLY, (error) => {
    if (error)
        console.error(error.message)
    else
        console.log(`Connected to the DB: ${title}.`)
})

// Elaborates SQLite DB
lib.getNumberOfChapters(db, (numChapters) => {
    lib.SQLiteToJSON(db, numChapters, (chapters) => {
        db.close((error) => {
            if (error)
                console.error.apply(error.message)
            else
                console.log('DB closed.')
        })
        lib.writeToJSON(chapters, title)
    })
})