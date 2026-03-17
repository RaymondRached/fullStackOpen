import { useEffect } from 'react'
import { useState } from 'react'
import axios from 'axios'

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456', id: 1 },
    { name: 'Ada Lovelace', number: '39-44-5323523', id: 2 },
    { name: 'Dan Abramov', number: '12-43-234345', id: 3 },
    { name: 'Mary Poppendieck', number: '39-23-6423122', id: 4 }
  ])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filterInput,setFilterInput] = useState('')

  const hook = () => {
    axios
    .get('http://localhost:3001/persons')
    .then(response => setPersons(response.data))
  }

  useEffect(hook,[])

  const addPerson = (event) => {
    event.preventDefault()
    if (!persons.some((person) => person.name === newName)){
      const newPerson = { name: newName, number:newNumber, id: persons.length+1 }
      setPersons(persons.concat(newPerson))
    } else {
      alert(`${newName} is already added to phonebook`)
    }
    setNewName('')
    setNewNumber('')
  }

  const filterResult = persons.filter(person => person.name.toLowerCase().includes(filterInput))

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter filterInput={filterInput} setFilterInput={setFilterInput}/>
      <h3>Add a new</h3>
      <PersonForm
        newName={newName}
        setNewName={setNewName}
        newNumber={newNumber}
        setNewNumber={setNewNumber}
        addPerson={addPerson}
      />
      <h3>Numbers</h3>
    <Persons filterResult={filterResult}/>
    </div>
  )
}

const Filter = ({filterInput,setFilterInput}) => {
  return (
    <div>
      filter shown with
      <input value={filterInput} onChange={(e) => setFilterInput(e.currentTarget.value)}/>
    </div>
  )
}

const PersonForm = ({ newName, setNewName, newNumber, setNewNumber, addPerson }) => {
  return(
    <form onSubmit={addPerson} >
      <div>
        name: <input value={newName} onChange={(e)=>setNewName(e.currentTarget.value)}/>
      </div>
      <div>
        number: <input value={newNumber} onChange={(e)=>setNewNumber(e.currentTarget.value)}/>
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  )
}

const Persons = ({filterResult}) => {
  return(
    <div>
      {filterResult.map(person => <div key={person.id}>{person.name} {person.number}</div>)}
    </div>
  )
}

export default App