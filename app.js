const feathers = require("@feathersjs/feathers")
const express = require("@feathersjs/express")
const socketio = require("@feathersjs/socketio")
require("dotenv").config()

const app = express(feathers())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(__dirname))

// use for declare app is Rest API
app.configure(express.rest())

// use for declare app use socketIO (Realtime Backend)
app.configure(socketio())

class MessageService {
  constructor() {
    this.messages = []
  }

  async find() {
    return this.messages
  }

  async create(data) {
    const message = {
      id: this.messages.length,
      text: data.text
    }
    this.messages.push(message)
    return message
  }
}

app.use("/messages", new MessageService())

app.use(express.errorHandler())

// Create connection for socketIO ?
app.on('connection', (connection) => {
  app.channel('everybody').join(connection)
})

// *** Important ***
// Don't use () => {} if use can't use realtime wtfffff
app.publish(() => app.channel('everybody'))

const PORT = process.env.PORT || 9000
app.listen(PORT).on('listening', () => {
  console.log(`Feathers server listenning on port : ${PORT}`)
})

// Service link with app.use 
app.service("messages").create({
  text: "Hello Feathers from the servers"
})

app.service("messages").on('created', (message) => {
  console.log('Add new message : ', message)
})