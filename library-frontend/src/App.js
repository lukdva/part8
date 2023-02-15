import { useState, useEffect } from 'react'
import { useSubscription, useApolloClient } from '@apollo/client'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import Login from './components/Login'
import Recommendations from './components/Recommendations'
import { BOOK_ADDED_SUBSCRIPTION, ALL_BOOKS } from './queries'

const App = () => {
  const [page, setPage] = useState('authors')
  const [token, setToken] = useState(null)
  const client = useApolloClient()

  const logout = () => {
    localStorage.removeItem('user-token')
    setToken(null)
  }
  useEffect(() => {
    const storageToken = localStorage.getItem('user-token')
    setToken(storageToken)
  }, [])

  useSubscription(BOOK_ADDED_SUBSCRIPTION, {
    onData: ({ data }) => {
      const addedBook = data.data.bookAdded
      // window.alert(`New book was added ${addedBook.title}`)
      client.cache.updateQuery({ query: ALL_BOOKS}, ({ allBooks }) => {
        return {
          allBooks: allBooks.concat(addedBook)
        }
      })
    }
  })

  return (
    <div>
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        <button onClick={() => setPage('add')}>add book</button>
        <button onClick={() => setPage('recommend')}>recommend</button>
        { !token ? <button onClick={() => setPage('login')}>login</button> : null }
        { token? <button onClick={logout}>logout</button> : null }
      </div>

      <Authors show={page === 'authors'} />

      <Books show={page === 'books'} />

      <NewBook show={page === 'add' && token} />

      <Recommendations show={page === 'recommend' && token}/>

      <Login show={page === 'login'} setToken={setToken} setPage={setPage}/>
    </div>
  )
}

export default App
