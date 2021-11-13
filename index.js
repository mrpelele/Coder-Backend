const fs = require('fs')
const express = require('express')
const multer = require('multer')
const http = require('http')
const Container = require('./Functionalities/Constructor')
const handlebars = require('express-handlebars')
const { Router } = express

const app = express()

const server=http.createServer(app)

app.use(express.json())
app.use(express.urlencoded({extended:false}))

const router = Router()

app.use('/api',router)
// multer
let storage = multer.diskStorage({
    destination:function(req,res,cb){
        cb(null,'update')
    },
    filename:function(req,res,cb){
        cb(null,'multerFilesTest_'+res.originalname)
    }
})

let update = multer({storage}) 

//handlebars

app.set('views','./views')
app.set('view engine', 'hbs')

app.engine('hbs', handlebars({
    extname:'.hbs',
    layoutsDir: __dirname+'/views/layouts',
    defaultLayout:'main.hbs'
}))


const container = new Container ('./data/db.txt')

    router.get("/",async (req,res) => {

        let product = await container.getAll()

        console.log(product)

        res.render('products.hbs',{product:product})

    })

    router.get("/addProducts", (req,res) => {

        res.render('addProducts.hbs')

    })

    router.post("/addProducts",async (req,res) => {

        console.log('aaaaaaaaaa',req.body)
        const {name,price} = req.body
        const obj = {name,price}
        await container.saveProd(obj)
        console.log('saved')
        res.redirect("/api")
    
    })

    router.get("/allProducts", async (req,res) => {

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

    router.post("/product/add",async  (req,res) => {

        const {name,price} = req.body
        const obj = {name,price}
        res.send(await container.saveProd(obj))
        console.log('saved')

    })

    router.delete("/product/:id", async (req,res) => {

        res.send(await container.deleteById(JSON.parse(req.params.id)))

    })

    router.post("/save",update.single('myfile'), (req,res) => {

        console.log(req.file)
        res.send('archivo cargado')

    })

server.listen(8080, () => {

    console.log('server running at 8080')

})


