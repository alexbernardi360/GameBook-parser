// Requires external module
const path    = require('path')

// Requires internal modules
const db    = require('./lib/aa-sqlite3')
const lib   = require('./lib/GBlib')

async function main() {
    // Get the path of the SQLite file from command line arguments.
    const file_path = process.argv[2]

    if (file_path) {
        // Get title of the GameBook
        const title = path.basename(file_path, path.extname(file_path))

        try {
            // Connects to SQLite DB
            console.log(await db.open(file_path))

            // Creation of object containing data
            const GameBook  = {
                "chapters": await lib.makeChapters(db),
                "info":     await lib.makeInfo(db),
                "intro":    await lib.makeIntro(db),
                "rules":    await lib.makeRules(db)
            }

            // Exporting the object to file
            console.log(await lib.exportToFile(GameBook, title))

            // Closing the DB
            db.close()

        } catch (error) {
            console.log(error)
        }
    } else
        console.log('Too few arguments: the path to the GameBook in SQLite3 format is missing.')
}

main()
