const knex = require("knex").knex({
    client:"mysql",
    connection:{
        host:"127.0.0.1",
        port:3306,
        user:"root",
        database:"coderbe",

    },
    pool:{min:2,max:8}
});

knex.schema.createTableIfNotExists('products',(table) => {
    table.increments("id").primary();
    table.string("name");
    table.integer("price");
    table.string("description");
    table.integer("stock").defaultTo(0);
})
.then (()=> console.log('table created'))
.catch((err) => {console.log(err)})



module.exports = knex
