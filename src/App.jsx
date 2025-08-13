import { useState } from 'react'
import './App.css'
import { MovieCard , searchMovies} from './components/MovieCard'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <h1>Movie-App</h1>
      <MovieCard />

     
    </>
  )
}

export default App
