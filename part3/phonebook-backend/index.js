require('dotenv').config()
const express = require('express')
const Person = require('./models/person')
const morgan = require('morgan')
const app = express()

app.use(express.static('dist'))

app.use(express.json());
morgan.token('POST_content', function (req, res) {
    if (req.method === 'POST'){
        return JSON.stringify(req.body)
    }
    return null
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :POST_content'))

app.get('/api/persons',(request,response) => {
    Person.find({}).then(persons => 
        response.json(persons)
    ).catch(error => next(error))
})

app.get('/api/persons/:id',(request,response) => {
    Person.findById(request.params.id)
    .then((person) => {
        if (!person){
            return response.status(404).end()
        }
        return response.json(person)
    }).catch(error => next(error))
})

app.get('/info',(request,response) => {
    console.log('hi')
    Person.countDocuments({}).then((length) => {
        const date = new Date()
        const entries = `Phonebook has info for ${length} people`
        response.send(`<p>${entries}</p><p>${date}</p>`)
    }).catch(error => next(error))
})

app.delete('/api/persons/:id',(request,response) => {
    Person.findByIdAndDelete(request.params.id)
    .then(result =>
        response.status(204).end()
    ).catch(error => next(error))
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
    const newPerson = new Person({
        name: body.name,
        number: body.number
    })
    newPerson.save().then((savedPerson) =>{
        response.json(savedPerson)
    }).catch(error => next(error))
})

app.put('/api/persons/:id',(request,response) => {
    Person.findById(request.params.id)
    .then((person) => {
        if (!person){
            return response.status(404).end()
        }
        person.number = request.body.number
        return person.save().then(updatedPerson => 
            response.json(updatedPerson)
        )
    }).catch(error => next(error))
})

const errorHandler = (error, request, response, next) => {
    console.log(error.message)

    if (error === 'CastError'){
        return response.status(400).send({error:"malformed id"})
    }

    next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT,() => {
    console.log(`Server running on port ${PORT}`)
})