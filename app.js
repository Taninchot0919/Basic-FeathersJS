const feathers = require("@feathersjs/feathers")
const app = feathers()

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

app.use("messageService", new MessageService())

app.service("messageService").on("created", (data) => {
  console.log("A new message has been created : ", data)
})

const main = async () => {
  await app.service("messageService").create({
    text: "Test text1"
  })
  await app.service("messageService").create({
    text: "Test text2"
  })

  const allMessage = await app.service("messageService").find()
  console.log("All messages : ", allMessage)
}
main()