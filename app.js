const fs = require('fs')
const http = require('http')
const net = require('net')

if (!fs.existsSync('uploads/')) {
  fs.mkdirSync('uploads')
}

const HOST = process.env['HOST'] || 'localhost'

net.createServer((socket) => {
  socket.on('data', (data) => {
    const name = Math.random().toString(36).substring(2, 10)

    socket.write(`http://${HOST}:8080/${name}\n`)
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
}).listen(9999, '127.0.0.1')

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

server.listen(8080, () => console.log('Listening...'))
