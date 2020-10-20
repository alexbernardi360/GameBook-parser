// Requires imported modules
const fs    = require('fs')

exports.getNumberOfChapters = function(db, callback) {
    db.serialize(() => {
        // prepare the query
        let query = 'SELECT COUNT(id_entity) AS number FROM T_ENTITY WHERE entity_type = "chapter"';
        db.get(query, (err, rows) => {
            if (err)
                console.log(err)
            callback(rows.number)
        })
    })
}

exports.SQLiteToJSON = function(db, totalChapters, callback) {
    db.serialize(() => {
        let query = 'SELECT * FROM T_ENTITY JOIN T_ENTITY_ATTRIBUTES ON T_ENTITY.id_entity = T_ENTITY_ATTRIBUTES.id_entity WHERE T_ENTITY.entity_type = \'chapter\'';
        db.all(query, (err, rows) => {
            
            if (err)
                console.log(err)

            var chapters = []

            for (var i = 0; (i < totalChapters * 5); i+=5) {
                var chapter
                var number, description, flag_ending, flag_fixed, flag_deadly, chapter_title, next_chapters
                number = rows[i].entity_name;
                console.log(i)
                for (var j = i; (j < i+5); j++) {
                    console.log(i + ' cazzo')
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

                chapter = {
                    "number": number,
                    "description": description,
                    "flag_fixed": flag_fixed,
                    "flag_ending": flag_ending,
                    "flag_deadly": flag_deadly,
                    "chapter_title": chapter_title,
                    "next_chapters": next_chapters
                }
                //console.log(chapter)
                chapters.push(chapter)
            }
            callback(chapters)
        })
    })
}

exports.writeToJSON = function(chapters, title) {
    // Convert JSON object to string
    const data = JSON.stringify(chapters, null, 4)

    // write JSON string to a file
    fs.writeFile(`${title}.json`, data, (error) => {
        if (error)
            console.error(error)
        console.log(`JSON data is saved in ${title}.json`)
    });
}

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
            nextChapters.push(number)
            number = ''
        }
    }
    return nextChapters
}