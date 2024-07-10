const express = require('express')
const app = express()
var morgan = require('morgan')
const cors = require('cors')

app.use(cors())

app.use(express.static('dist'))

app.use((req, res, next) => {
  const oldSend = res.send;
  res.send = function(data) {
    res.locals.body = data;
    oldSend.apply(res, arguments);
  }
  next();
});

morgan.token('body', (req, res) => res.locals.body);

app.use(express.json())

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));

let persons = [
    {
        "id": "1",
        "name": "Arto Hellas",
        "number": "040-123456"
      },
      {
        "id": "2",
        "name": "Ada Lovelace",
        "number": "39-44-5323523"
      },
      {
        "id": "3",
        "name": "Dan Abramov",
        "number": "12-43-234345"
      },
      {
        "id": "4",
        "name": "Mary Poppendieck",
        "number": "39-23-6423122"
      }
  ]

  app.get('/api/persons', (request, response) => {
    response.json(persons)
  })

  app.get('/info', (request, response) => {
    const date = new Date()
    response.send(`<p>Phonebook has info for ${persons.length} people</p> <p>${date}</p>`)
  })

  app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const person = persons.find(person => person.id === id)

    if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
  })

  app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    persons = persons.filter(person => person.id !== id)
  
    response.status(204).end()
  })

  const generateId = () => {
    let id = Math.floor(Math.random() * 1000000);
    while (persons.find(person => person.id === id)) {
      id = Math.floor(Math.random() * 1000000);
    }
    return String(id);
  }
  
  app.post('/api/persons', (request, response) => {
    const body = request.body
  
    if (!body.name) {
      return response.status(400).json({ 
        error: 'name missing' 
      })
    }

    if (!body.number) {
      return response.status(400).json({ 
        error: 'number missing' 
      })
    }

    if (persons.find(person => person.name === body.name)) {
        return response.status(400).json({ 
          error: 'name must be unique' 
        })
    }
  
    const person = {
      name: body.name,
      number: body.number,
      id: generateId(),
    }
  
    persons = persons.concat(person)
  
    response.json(person)
  })

    const PORT = process.env.PORT || 3001
    app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })