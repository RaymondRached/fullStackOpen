const express = require('express')
const morgan = require('morgan')
const app = express()

app.use(express.json());
morgan.token('POST_content', function (req, res) {
    if (req.method === 'POST'){
        return JSON.stringify(req.body)
    }
    return null
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :POST_content'))

persons = [
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

app.get('/api/persons',(request,response) => {
    response.json(persons)
})

app.get('/api/persons/:id',(request,response) => {
    const id = request.params.id
    const person = persons.find(p => p.id === id)
    if (person){
        response.json(person)
    } else {
        response.status(404).end()
    }
})

app.get('/info',(request,response) => {
    const date = new Date()
    const entries = `Phonebook has info for ${persons.length} people`
    response.send(`<p>${entries}</p><p>${date}</p>`)
})

app.delete('/api/persons/:id',(request,response) => {
    const id = request.params.id
    persons = persons.filter(p => p.id !== id)

    response.status(204).end()
})

app.post('/api/persons',(request,response) => {
    const body = request.body
    if (!body.name){
        return response.status(400).json({
            error:"name is missing"
        })
    }
    if (!body.number){
        return response.status(400).json({
            error:"number is missing"
        })  
    }
    if (persons.find(p => p.name === body.name)){
        return response.status(409).json({
            error:"name must be unique"
        })  
    }
    const person = {...body,id:String(Math.floor(Math.random()*10000000))}
    persons.push(person)
    response.json(person)
})

const PORT = process.env.PORT || 3001
app.listen(PORT,() => {
    console.log(`Server running on port ${PORT}`)
})
