/* const Container = require('../../Functionalities/Constructor')
const container = new Container ('./data/db.txt')
 */

const socket = io()
socket.on('messagesBE', data => {
    console.log('array object',data)

    socket.emit('messagesClient','soy cliente')
    if (data) {
        render(data)
    }
    
})

const render = (data) => {
    let html = data.map(e => {
        return `
        <p> name:${e.name} price:${e.price}</p>
        `
    }).join(" ")

    document.querySelector("#box").innerHTML = html

} 

const addInfo = () => {

    console.log('websockets obj')

    let obj = {
        name:document.querySelector("#nameP").value,
        price:document.querySelector("#priceP").value,
        description:document.querySelector("#descriptionP").value,
        stock:document.querySelector("#stockP").value
    }

    console.log('websockets obj',obj)
    socket.emit("updateList",obj)

    /* container.saveProd(obj) */


    return false
}






