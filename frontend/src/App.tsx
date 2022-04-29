import { useEffect, useState } from 'react'
import './App.css'

function App() {

  const [votes, setVotes] = useState(100);

  useEffect(() => {
    setTimeout(() => {
      setVotes((prev) => prev + 100)
    }, 500)
  }, [])

  return (
    <div className="App">
      <div className="polling-test">
        <h1> Polling test </h1>
        <div className="poll-bar" style={{ width: votes }}></div>
      </div>
    </div>
  )
}

export default App
