const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
app.use(express.static('build'))
app.use(cors())
app.use(express.json())


morgan.token('content', function getContent (req) {
    return JSON.stringify(req.body)
})


app.use(morgan(':method :url :status :res[content-length] - :response-time ms :content'))

let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/api/persons', (request,response) => {
    response.json(persons)
})

app.get('/info',(request,response) => {
    const time = new Date()
    const num = persons.length
    response.send(`<b>Phone has info for ${num} people</b>
                <br/>
                <b>${time}</b>
    
    `)
})

app.get('/api/persons/:id', (request,response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)
    if (person){
        response.json(person)
    } else {
        response.status(404).end()
    }

})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(note => note.id !== id)
  
    response.status(204).end()
  })

app.post('/api/persons', (request,response) => {
    const body = request.body

    const checkExistName = persons.find(person => person.name == body.name) ? true : false


    if (!body.name) {
        return response.status(400).json({ 
          error: 'content missing' 
        })
      } else if (checkExistName) {
        return response.status(400).json({
            error: 'name must be unique'
        })
      }
    
      const person = {
        id: Math.floor(Math.random() * 10000),
        name: body.name,
        number: body.number,
        
      }
    
      persons = persons.concat(person)
    
      response.json(person)
  

})


const PORT = process.env.PORT || 3002
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })