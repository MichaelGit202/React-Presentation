import { useState } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  const updateCounter = () => {
    setCount((count) => count + 1);
  };


  return (
    <>
        <button onClick={updateCounter}>
          count is {count}
        </button>
    </>
  )
}

export default App
