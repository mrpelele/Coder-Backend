const fs = require('fs')

const readFileAsync = async (route) => {
    let storedData = await fs.promises.readFile(route, 'utf-8')
    return storedData
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
            console.log(objArray)
            return objArray

        } else {
            console.log('database empty')
        }

    }

}

module.exports = Container;