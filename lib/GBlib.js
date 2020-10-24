// Requires external module
const fs        = require('fs')

// Requires internal module
const sqlite3   = require('./aa-sqlite3')

// Gets number of chapters in a GameBook
exports.getNumberOfChapters = async (db) => {
    // Preparing the query
    const query = 'SELECT COUNT(id_entity) AS number FROM T_ENTITY WHERE entity_type="chapter"'
    // Query execution
    const row = await db.get(query)
    return row.number
}

// Returns an obj contains all the chapters of a GameBook
exports.makeChapters = async (db) => {
    // Preparing the query
    const query = 'SELECT * FROM T_ENTITY JOIN T_ENTITY_ATTRIBUTES ON T_ENTITY.id_entity=T_ENTITY_ATTRIBUTES.id_entity WHERE T_ENTITY.entity_type=\'chapter\''
    // Query execution
    const rows = await db.all(query)

    const totalChapters = await this.getNumberOfChapters(db)
    var chapters = []

    // Chapter array creation cycle
    for (var i = 0; (i < totalChapters * 5); i += 5) {
        var number, description = '', flag_ending = '', flag_fixed = '', flag_deadly = '', chapter_title = '', next_chapters = ''
        number = parseInt(rows[i].entity_name, 10)
        // Chapter creation cycle
        for (var j = i; (j < i+5); j++) {
            if (rows[j].attribute_name == 'description') {
                description = rows[j].attribute_value
                next_chapters = findNextPossibleChapter(description)
            }

            else if (rows[j].attribute_name == 'flag_fixed')
                flag_fixed = (rows[j].attribute_value == 'true')

            else if (rows[j].attribute_name == 'flag_final')
                flag_ending = (rows[j].attribute_value == 'true')

            else if (rows[j].attribute_name == 'flag_death')
                flag_deadly = (rows[j].attribute_value == 'true')

            else if (rows[j].attribute_name == 'chapter_title')
                chapter_title = rows[j].attribute_value
        }

        // Creation of the object "chapter"
        var chapter = {
            "number": number,
            "description": description,
            "flag_fixed": flag_fixed,
            "flag_ending": flag_ending,
            "flag_deadly": flag_deadly,
            "chapter_title": chapter_title,
            "next_chapters": next_chapters
        }
        // Insert the "chapter" object into the array
        chapters.push(chapter)
    }
    return chapters
}

// Returns an obj contains the info of a GameBook
exports.makeInfo = async (db) => {
    // Preparing the query
    const query = 'SELECT * FROM T_ENTITY JOIN T_ENTITY_ATTRIBUTES ON T_ENTITY.id_entity=T_ENTITY_ATTRIBUTES.id_entity WHERE T_ENTITY.entity_name=\'game\''
    // Query execution
    const rows = await db.all(query)

    var title = '', author = '', lgc_version = '', version = '', revision = ''
    for (var i = 0; (i < rows.length); i++)
        if (rows[i].attribute_name == 'title')
            title = rows[i].attribute_value
        else if (rows[i].attribute_name == 'author')
            author = rows[i].attribute_value
        else if (rows[i].attribute_name == 'lgc_version')
            lgc_version = rows[i].attribute_value
        else if (rows[i].attribute_name == 'version')
            version = rows[i].attribute_value
        else if (rows[i].attribute_name == 'revision')
            revision = parseInt(rows[i].attribute_value, 10)

    // Creation of the object "info"
    const info = {
        "title": title,
        "author": author,
        "lgc_version": lgc_version,
        "version": version,
        "revision": revision
    }

    return info
}

// Returns an obj contains the intro of a GameBook
exports.makeIntro = async (db) => {
    // Preparing the query
    const query = 'SELECT * FROM T_ENTITY JOIN T_ENTITY_ATTRIBUTES ON T_ENTITY.id_entity=T_ENTITY_ATTRIBUTES.id_entity WHERE T_ENTITY.entity_name=\'intro\''
    // Query execution
    const rows = await db.all(query)

    var chapter_title = '', description = ''
    for (var i = 0; (i < rows.length); i++)
        if (rows[i].attribute_name == 'chapter_title')
            chapter_title = rows[i].attribute_value
        else if (rows[i].attribute_name == 'description')
            description = rows[i].attribute_value

    // Creation of the object "intro"
    const intro = {
        "chapter_title": chapter_title,
        "description": description
    }

    return intro
}

// Returns an obj contains the rules of a GameBook
exports.makeRules = async (db) => {
    // Preparing the query
    const query = 'SELECT * FROM T_ENTITY JOIN T_ENTITY_ATTRIBUTES ON T_ENTITY.id_entity=T_ENTITY_ATTRIBUTES.id_entity WHERE T_ENTITY.entity_name=\'rules\''
    // Query execution
    const rows = await db.all(query)

    var chapter_title = '', description = ''
    for (var i = 0; (i < rows.length); i++)
        if (rows[i].attribute_name == 'chapter_title')
            chapter_title = rows[i].attribute_value
        else if (rows[i].attribute_name == 'description')
            description = rows[i].attribute_value

    // Creation of the object "intro"
    const rules = {
        "chapter_title": chapter_title,
        "description": description
    }

    return rules
}

// Exports the JSON object on a file.
exports.exportToFile = (obj, title) => {
    return new Promise((resolve, reject) => {
        // Convert JSON object to string
        const data = JSON.stringify(obj, null, 4)

        // write JSON string to a file
        fs.writeFile(`${title}.json`, data, (error) => {
            if (error)
                reject(error.message)
            else
                resolve(`JSON data is saved in =>\t${title}.json`)
        })
    })
}

// Finds the next chapters in the description
function findNextPossibleChapter(text) {
    var nextChapters = [];
    var number = '';

    for (i = 0; (i < text.length); i++) {
        if (text.charAt(i) == '[') {
            i++;
            while (text.charAt(i) != ']') {
                if ((text.charAt(i) == '0') ||
                    (text.charAt(i) == '1') ||
                    (text.charAt(i) == '2') ||
                    (text.charAt(i) == '3') ||
                    (text.charAt(i) == '4') ||
                    (text.charAt(i) == '5') ||
                    (text.charAt(i) == '6') ||
                    (text.charAt(i) == '7') ||
                    (text.charAt(i) == '8') ||
                    (text.charAt(i) == '9'))
                    number = number + text.charAt(i)
                i++
            }
            nextChapters.push(parseInt(number, 10))
            number = ''
        }
    }
    return nextChapters
}