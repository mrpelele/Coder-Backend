const fs = require('fs')
const express = require('express')
const bp = require('body-parser')
const { Router } = express
const Container = require('./Functionalities/Constructor')

const app = express()
const router = Router()
app.use(bp.json())
app.use(bp.urlencoded({extended: true}))

const container = new Container ('./data/db.txt')
       
    router.get("/", (req,res) => {

        res.send('main page')

    })

    router.get("/hola", (req,res) => {

        res.send('hola')

    })

    router.get("/product", async (req,res) => {

        res.send(await container.getAll());

    })

    router.get("/product/:id", async (req,res) => {

        res.send(await container.getById(JSON.parse(req.params.id)))

    })

    router.get("/productR", async (req,res) => {

        randomNum = Math.floor(Math.random() * 5) + 1
        res.send(await container.getById(randomNum))

    })

    router.put("/product/:id" , async (req,res) => {

        const {name,price} = req.body
        const id = JSON.parse(req.params.id)
        const obj = {name,price,id}
        res.send(await container.updateProd(id,obj))
        console.log('updated!')

    })

    router.post("/product/add", async (req,res) => {

        const {name,price} = req.body
        const obj = {name,price}
        res.send(await container.saveProd(obj))
        console.log('saved')

    })

    router.delete("/product/:id", async (req,res) => {

        res.send(await container.deleteById(JSON.parse(req.params.id)))

    })

app.use('/api',router)

app.listen(3007, () => {

    console.log('server running at 3007')

})


