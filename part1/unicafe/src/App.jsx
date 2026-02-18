import { useState } from 'react'

const Statistics = ({good,neutral,bad,all}) => {
  if (all === 0) {
    return(
      <div><br></br>No feedback given</div>
    )
  }
  return(
    <div>
      <h1>statistics</h1>
      <StatisticLine text="good" value={good}/>
      <StatisticLine text="neutral" value={neutral}/>
      <StatisticLine text="bad" value={bad}/>
      <StatisticLine text="all" value={all}/>
      <StatisticLine text="average" value={(good-bad)/all}/>
      <StatisticLine text="positive" value={(good/all*100)+' %'}/>
    </div>
  )
}

const StatisticLine = ({text,value}) => <div>{text} {value}</div>

const Button = ({name,onClick}) => <button onClick={onClick}>{name}</button>

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const all = good+neutral+bad

  return (
    <div>
      <h1>give feedback</h1>
      <Button name="good" onClick={() => setGood(good+1)}/>
      <Button name="neutral" onClick={() => setNeutral(neutral+1)}/>
      <Button name="bad" onClick={() => setBad(bad+1)}/>
      <Statistics good={good} neutral={neutral} bad={bad} all={all}/>
    </div>
  )
}

export default App