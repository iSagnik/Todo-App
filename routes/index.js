var express = require('express');
var router = express.Router();

/* Project:
   Todo Table
   id, name, isCompleted
*/

//DEBUG=node-backend-wkshop:* npm start

//create sqlite3 object
var knex = require('knex') ( {
    client: 'sqlite3',
    connection: {
        filename: "./mydb.dqlite"
    }

} )

//setting up the database with sqlite3
knex.schema
    .hasTable('Todos')
        .then( (exists) => {
            if (!exists) {
                return knex.schema.createTable('Todos', (table) => {
                    table.increments('id').primary()
                    table.string('Name')
                    table.boolean('isComplete')
                })
                .then( () => {
                    console.log("Table \'Todos\' created")
                })
                .catch((error) => {
                    console.error(`There was an error creating the table: ${error}`)
                })
            }
        })
        .then(() => {
            console.log("Done setting up the database")
        })
        .catch((error) => {
            console.error(`There was an error setting up the database: ${error}`)
        })

knex.schema.hasColumn('Todos', 'Name').then( (exists) => {
    if (!exists)
        console.log("Nope")
    else
        console.log("Yup")
})
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/createtodo', function(req, res, next) {
    knex('Todos').insert( {'Name': "Test Todo", 'isComplete': false}).then( () => {
        res.render('index', { title: 'Created' });
    })
    .catch((error) => {
        res.render('index', { title: `Error ${error}` });
    })
  });

module.exports = router;
