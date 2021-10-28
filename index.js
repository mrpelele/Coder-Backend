const fs = require('fs')
const express = require('express')
const Container = require('./Functionalities/Constructor')

const app = express()

const container = new Container ('./data/db.txt')
       
    app.get("/", (req,res) => {

        res.send('main')

    })

    app.get("/hola", (req,res) => {

        res.send('hola')

    })

    app.get("/product", async (req,res) => {

        res.send(await container.getAll());

    })

    app.get("/productRandom", async (req,res) => {

        

        randomNum = Math.floor(Math.random() * 3) + 1

        res.send(await container.getById(randomNum))

    })

app.listen(3007, () => {

    console.log('server running at 3007')

})


