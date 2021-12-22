const express = require('express')
const { Router } = express
const Container = require('./Functionalities/Constructor')
const app = express()

const {Server: HttpServer} = require('http')
const { Server: Socket } = require('socket.io')
const handlebars = require('express-handlebars')

const router = Router()

app.use(express.json())
app.use(express.urlencoded({extended:false}))
router.use(express.urlencoded({extended:false}))

app.use('/api',router)

const admin = true;
const server = new HttpServer(app)
const io = new Socket(server)
//static

app.use(express.static(__dirname + "/views/layouts"))

// multer
const multer = require('multer')

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

//products



    router.get("/products",async (req,res) => {

        if (admin) {
            let product = await container.getAll()

            res.render('products.hbs',{product:product})
        } else {
            res.send('ACCESS DENIED')
        }
    })

    router.get("/addProducts", (req,res) => {

        if (admin) {
            res.render('addProducts.hbs')
        } else {
            res.send('ACCESS DENIED')
        }

    })

    router.post("/addProducts",async (req,res) => {
        
        if (admin) {
            const {name,price,description,stock} = req.body
            const obj = {name,price,description,stock}
            await container.saveProd(obj)
            console.log('saved')
        } else {
            res.send('ACCESS DENIED')
        }
    })

    router.get("/products/all", async (req,res) => {

        if (admin) {

        res.send(await container.getAll());
        } else {
            res.send('ACCESS DENIED')
        }
    })

    router.get("/product/:id", async (req,res) => {

        if (admin) {
            res.send(await container.getById(JSON.parse(req.params.id)))
        } else {
            res.send('ACCESS DENIED')
        }  
    })

    router.get("/productRandom", async (req,res) => {

        if (admin) {
            randomNum = Math.floor(Math.random() * 5) + 1
            res.send(await container.getById(randomNum))
        } else {
            res.send('ACCESS DENIED')
        }
    })

    router.put("/product/:id" , async (req,res) => {

        if (admin) {
            const {name,price,description,stock} = req.body
            const id = JSON.parse(req.params.id)
            const obj = {name,price,description,stock,id}
            res.send(await container.updateProd(id,obj))
            console.log('updated!')
        } else {
            res.send('ACCESS DENIED')
        }
    })

    router.post("/product/add",async  (req,res) => {

        if (admin) {
            console.log('aaaaaaaaaaaaaaaaaaaa',req.body)
            const {name,price,description,stock} = req.body
            const obj = {name,price,description,stock}
            res.send(await container.saveProd(obj))
            console.log('saved')

        } else {
            res.send('ACCESS DENIED')
        }
    })

    router.delete("/product/delete/:id", async (req,res) => {

        if (admin) {
            res.send(await container.deleteById(JSON.parse(req.params.id)))
        } else {
            res.send('ACCESS DENIED')
        }
    })

//files    

    router.post("/save",update.single('myfile'), (req,res) => {

        if (admin) {
            console.log(req.file)
            res.send('archivo cargado')

        } else {
            res.send('ACCESS DENIED')
        }
    })

//cart

const cart = new Container ('./data/cart.txt')

    router.get("/cart/view", async (req,res) => {

        if (admin) {
            res.send(await cart.getAll());
        } else {
            res.send('ACCESS DENIED')
        }       

    })

    router.post("/cart/create",async (req,res) => {
            

        if (admin) {
            const {name,price,description,stock} = req.body
            const obj = {name,price,description,stock}
            await cart.saveProdCart(obj)
            console.log('saved cart')
            res.redirect("/api")
        } else {
            res.send('ACCESS DENIED')
        }
    })   

    router.delete("/cart/delete", async (req,res) => {

        if (admin) {
            res.send(await cart.deleteAll())
        } else {
            res.send('ACCESS DENIED')
        }
    })

    router.delete("/cart/delete/:id", async (req,res) => {

        if (admin) {
            res.send(await cart.deleteByIdCart(JSON.parse(req.params.id)))
        } else {
            res.send('ACCESS DENIED')
        }
    })

//websockets

router.get("/chat",async (req,res) => {

    if (admin) {
        res.render('chat.hbs')
    } else {
        res.send('ACCESS DENIED')
    }
})

    io.on('connection', async (socket) => {
        console.log('aaaaahhhh... por fin')

        let product = await container.getAll()
        let chatArr = []
        
        socket.on('messagesClient', (data) => {
            console.log('desde FE: ',data)
        })
        socket.on('messageClient_chat', (data) => {
            console.log('chat actualizado:',data)
        })
        
        socket.on('updateList', (data) => {
            
            product.push(data)
            container.saveProd(data)
            socket.emit('messagesBE',product)
            console.log('LIST')

        })

        socket.on('updateChat', (data) => {
            chatArr.push(data)
            socket.emit('messagesBE_chat',chatArr)
            console.log('CHAT')
        })



    });


server.listen(8080, () => {

    console.log('server running at 8080')

})

app.get("/", async (req,res) => {

    res.redirect("/api/products")    

})


