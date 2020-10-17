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

/* GET home page. */
router.get('/', function(req, res, next) {
    /* return todas in todo page */
    knex.select('*').from('Todos').then((data) => {
        console.log(data)
        res.render('todos', { title: 'My Todos:', todos: data })

    }).catch((error) => {
        console.log(`Error: ${error}`)
    })

    //res.render('index', { title: 'Express' });
});

router.get('/createtodo', function(req, res, next) {
    knex('Todos').insert( {'Name': "Test Todo", 'isComplete': false}).then( () => {
        res.render('index', { title: 'Created' });
    })
    .catch((error) => {
        res.render('index', { title: `Error ${error}` });
    })
  });

router.get('/delete/:id', function(req, res, next) {
    console.log(req.params.id)
    
    knex('Todos')
    .where('id', req.params.id)
    .del()
    .then( () => {
        res.render('index', {title: 'Deleted'})
    })
    .catch( (error) => {
        res.render('index', {title: `${error}`})
    })
});


module.exports = router;
