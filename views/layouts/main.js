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

socket.on('messagesBE_chat',data => {
    console.log('messagesBE_chat')

    socket.emit('messageClient_chat',data)
    renderChat(data)

})

const render = (data) => {

    let html = data.map(e => {
        return `
        <p> name:${e.name} price:${e.price}</p>
        `
    }).join(" ")

    document.querySelector("#box").innerHTML = html

} 

const renderChat = (data) => {

    console.log('dataaa',data)

    let html = data.map(e => {
        return `
        <p> usuario:${e.email} mensaje:${e.msg}</p>
        `
    }).join(" ")

    document.querySelector("#boxChat").innerHTML = html

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



    return false
}

const addChat = () => {

    console.log('CHAT XD')

    let obj = {
        email:document.querySelector('#nameE').value,
        msg:document.querySelector('#msg').value
    }

    console.log('le object',obj)
    socket.emit("updateChat",obj)

    return false

}






