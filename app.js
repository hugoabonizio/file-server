const fs = require('fs')
const http = require('http')
const net = require('net')
require('dotenv').config()

if (!fs.existsSync('uploads/')) {
  fs.mkdirSync('uploads')
}

const HOST = process.env.HOST || 'localhost'
const SOCKET_PORT = process.env.SOCKET_PORT || 9999
const HTTP_PORT = process.env.HTTP_PORT || 3000

net.createServer((socket) => {
  socket.on('data', (data) => {
    const name = Math.random().toString(36).substring(2, 10)

    socket.write(`http://${HOST}:${HTTP_PORT}/${name}\n`)
    fs.writeFile(`uploads/${name}`, data, (err) => {
      if (err) {
        console.error('Error writing file', err)
      }

      socket.destroy()
    })
  })

  socket.on('error', (err) => {
    console.error('Socket error', err)
  })
}).listen(SOCKET_PORT)

const server = http.createServer((req, res) => {
  console.log(new Date(), req.url)

  fs.readFile(`uploads/${req.url}`, (err, data) => {
    if (err) {
      console.error('Error sending file', err)
      return res.end('File not found')
    }

    res.end(data, 'utf-8')
  })
})

server.listen(HTTP_PORT, () => console.log(`Listening on ${HTTP_PORT}...`))
