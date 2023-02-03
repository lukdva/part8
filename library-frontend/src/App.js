import { useState, useEffect } from 'react'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import Login from './components/Login'


const App = () => {
  const [page, setPage] = useState('authors')
  const [token, setToken] = useState(null)

  const logout = () => {
    localStorage.removeItem('user-token')
    setToken(null)
  }
  useEffect(() => {
    const storageToken = localStorage.getItem('user-token')
    setToken(storageToken)
  }, [])
  
  return (
    <div>
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        <button onClick={() => setPage('add')}>add book</button>
        { !token ? <button onClick={() => setPage('login')}>login</button> : null }
        { token? <button onClick={logout}>logout</button> : null }
      </div>

      <Authors show={page === 'authors'} />

      <Books show={page === 'books'} />

      <NewBook show={page === 'add'} />

      <Login show={page === 'login'} setToken={setToken} setPage={setPage}/>
    </div>
  )
}

export default App
