// test server for notifications

/* 

import express from 'express'
import cors from 'cors'
const app = express()
const port = 3009

app.use(cors({
  origin: '*'
}))

const request = (req, res) => {
  const id = req?.params?.id
  const msg = req?.params?.msg 

  console.log(id, msg)

  setTimeout(() => {
    res.send({ 
      success: true, 
      data: (id && msg)
        ? ({ status: id, message: msg })
        : ({ status: 1, message: 'Server is working' })
    })
  }, 0)
}

app.get('/health/:id/:msg', request)
app.get('/health', request)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

*/