require('dotenv').config();
const express = require('express')
const app = express()
var morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/note')

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

  app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons => {
      response.json(persons)
    })
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

  app.put('/api/persons/:id', (req, res) => {
    const id = req.params.id;
    const { name, number } = req.body;
    const personIndex = persons.findIndex(person => person.id === id);
    if (personIndex === -1) {
      return res.status(404).send({ error: 'Person not found' });
    }
    const updatedPerson = { ...persons[personIndex], name, number };
    persons[personIndex] = updatedPerson;
    res.json(updatedPerson);
  });

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

    (Person.find({ name: body.name })).then(persons => {
      if (persons.length > 0) {
        return response.status(400).json({ 
          error: 'name must be unique' 
        })
      }
    })
  
    const person = new Person({
      name: body.name,
      number: body.number,
    })
  
    person.save().then(savedPerson => {
      response.json(savedPerson)
    })
  })

    const PORT = process.env.PORT || 3001
    app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })