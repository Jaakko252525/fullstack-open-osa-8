import { useState } from 'react'



// components 
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import LoginForm from './components/LoginForm'
import UsersFavoriteBooks from './components/UsersFavoriteBooks'
import FilterGraphql from './components/FilterGraphql'


// react router
import {
  BrowserRouter as Router,
  Routes, Route, Link
} from 'react-router-dom'

// query
import { useQuery } from '@apollo/client'


// importing query
import { ALL_AUTHORS, ALL_BOOKS } from './queries/qraphQLQueries'
import { useApolloClient } from '@apollo/client';





// main component
const App = () => {

  const [token, setToken] = useState(null)
  const [username, setUsername] = useState('')
  const [genre, setGenre] = useState('')


  const resultAuthors = useQuery(ALL_AUTHORS)
  const resultBooks = useQuery(ALL_BOOKS)

  // apollo client
  const client = useApolloClient()

  // if no token render this
  if (!token) {
    return (
      <div>
        <h2>Login</h2>
        <LoginForm
          setToken={setToken}
          setUsernameProp={setUsername}
        />
      </div>
    )
  }
  

  // logout function
  const logout = () => {
    console.log('username in app', username)
    setToken(null)
    setUsername('')
    localStorage.clear()
    client.resetStore()
  }



  return (

    <Router>
      <div>
        <Link to="/">home </Link>
        <Link to="/authors">authors </Link>
        <Link to="/books">books </Link>
        <Link to="/newBook">newBook </Link>
        <Link to="/favoriteBooks">Users favorite books</Link>
      </div>

      <Routes>
        <Route path="/" element={<div>Home screen
          <div>
                <button onClick={logout}>logout</button>
                <br/>
                <br/>
                <div>
                <div>
                  <h1>Change filter for books</h1>
                  <button onClick={() => setGenre("programming")}>"programming" </button>
                  <br/>
                  <button onClick={() => setGenre("fiction")}>"fiction" </button>
                  <br/>
                  <button onClick={() => setGenre("adventure")}>"adventure" </button>
                  <br/>
                  <button onClick={() => setGenre("action")}>"action" </button>
                </div>
                  <FilterGraphql genreProp={genre} />
                </div>
            </div>
        </div>} />
        
        <Route path="/authors" element={<Authors authorsProps={resultAuthors.data} />} />
        <Route path="/books" element={<Books bookProps={resultBooks.data} />} />
        <Route path="/newBook" element={<NewBook />} />
        <Route path='/favoriteBooks' element={<UsersFavoriteBooks usernameProp={username}/>}/>
      </Routes>

      <div>
        <i>Library app, by Jaakko No stack dev</i>
      </div>
    </Router>


  )
}

export default App













