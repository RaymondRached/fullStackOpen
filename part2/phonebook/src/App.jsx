import { useEffect } from 'react'
import { useState } from 'react'
import personService from './services/persons'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filterInput,setFilterInput] = useState('')

  const hook = () => {
    personService.getAll().then((initialPersons) => {
      setPersons(initialPersons)
    })
  }

  useEffect(hook,[])

  const addPerson = (event) => {
    event.preventDefault()
    const personToUpdate = persons.find(person => person.name === newName)
    const newPerson = { name: newName, number:newNumber }
    if (personToUpdate === undefined){
      personService.create(newPerson).then(createdPerson => setPersons(persons.concat(createdPerson)))
    } else {
      if (confirm(`${newName} is already added to phonebook, replace the old number with the new one?`)){
        const personId = personToUpdate.id
        personService
        .update(personId,newPerson)
        .then((updatedPerson) => {
          setPersons(persons.map((p) => (p.id === personId ? updatedPerson : p)))
        })
      }
    }
    setNewName('')
    setNewNumber('')
  }

  const deleteEntry = (id,name) => {
    if (confirm(`Delete ${name} ?`)) {
      personService
      .deleteHTTP(id)
      .then(setPersons(persons.filter(person => person.id !== id)))
    }
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
    <Persons filterResult={filterResult} deleteEntry={deleteEntry}/>
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

const Persons = ({filterResult,deleteEntry}) => {
  return(
    <div>
      {filterResult.map(person => 
        <div key={person.id}>{person.name} {person.number} <button onClick={() => deleteEntry(person.id,person.name)}>delete</button></div>
      )}
    </div>
  )
}

export default App