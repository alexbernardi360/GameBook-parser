// Requires external module
const path    = require('path')

// Requires internal modules
const db    = require('./lib/aa-sqlite3')
const lib   = require('./lib/GBlib')

async function main() {
    // Get the path of the SQLite file from command line arguments.
    const file_path = process.argv[2]

    // Get title of the GameBook
    const title = path.basename(file_path, path.extname(file_path))

    // Connects to SQLite DB
    console.log(await db.open(file_path))

    const GameBook  = {
        "chapters": await lib.makeChapters(db),
        "info":     await lib.makeInfo(db),
        "intro":    await lib.makeIntro(db),
        "rules":    await lib.makeRules(db)
    }

    console.log(await lib.exportToFile(GameBook, title))

    db.close()
}

main()
