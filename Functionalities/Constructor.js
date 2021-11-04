const fs = require('fs')

const readFileAsync = async (route) => {
    let storedData = await fs.promises.readFile(route, 'utf-8')
    return storedData
}

const writeFileAsync = async (prod,route) => {
    fs.writeFile(route,JSON.stringify(prod) ,{encoding:'utf-8'},(err) => {
        if (err) {
            console.log('no se a podido guardar el objeto')
        }
    })
}

class Container {

    constructor (route) {
        this.route=route
    }

    async getById(id) {

        let fileValidator = await readFileAsync(this.route)

        if (fileValidator) {

            let ValidatedObj = JSON.parse(fileValidator)
            let filteredProduct = ValidatedObj.find(element => element.id === id )

            if (filteredProduct) {      
                console.log('the prduct maching that id is:'+JSON.stringify(filteredProduct))   
                return (filteredProduct) 
            } else {
                console.log('product not found')
            }
        } else {
            console.log('no products in db')
        }
    }

    async getAll() {

        let fileValidator = await readFileAsync(this.route)
        

        if (fileValidator) {

            let objArray = JSON.parse(fileValidator)
            console.log('this is the entire db:')
            return objArray

        } else {
            console.log('database empty')
        }

    }

    async saveProd(prod) {

        let finalProd = []
        
        let fileValidator = await readFileAsync(this.route)
        
        if (fileValidator && fileValidator.length >= 0) {

            finalProd = JSON.parse(fileValidator)
            prod.id = finalProd.length+1
            let currentObjId = prod.id
            finalProd.push(prod)
            console.log(finalProd)
            writeFileAsync(finalProd,this.route,currentObjId)

        } else {
            prod.id = 1
            let currentObjId = JSON.stringify(prod.id)
            finalProd.push(prod)
            writeFileAsync(finalProd,this.route,currentObjId)
        }

    }

    async updateProd(id,prod) {

        let fileValidator = await readFileAsync(this.route)

        if (fileValidator) {

            let ValidatedObj = JSON.parse(fileValidator)
            let filteredProduct = ValidatedObj.filter(element => element.id !== id )
            filteredProduct.push(prod)

            if (filteredProduct) {

                writeFileAsync(filteredProduct,this.route,id)

            } else {

                console.log('error updating product')

            }

        } else {

            console.log('product not found')

        }
    } 

    async deleteById(id) {

        let fileValidator = await readFileAsync(this.route)

        if (fileValidator) {

            let ValidatedObj = JSON.parse(fileValidator)
            let filteredProduct = ValidatedObj.filter(element => element.id !== id )

            if (filteredProduct) {

                writeFileAsync(filteredProduct,this.route)
                console.log('product deleted')

            } else {

                console.log('error deleting product')

            }

        }
    } 




}

module.exports = Container;