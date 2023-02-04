import { useQuery } from '@apollo/client'
import { useState } from 'react'
import { ALL_BOOKS } from '../queries'
import GenreFilter from './GenreFilter'
import BookList from './BookList'

const Books = ({show}) => {
  const [genre, setGenre] = useState('all')
  const result = useQuery(ALL_BOOKS)
  if (!show) {
    return null
  }
  if(result.loading)
    return <div>loading...</div>

  const books = result.data.allBooks

  const genres = [...new Set(
    books.reduce(
      (first, second) => {
        return first.concat(second.genres)
      }, [])
    )]

  return (
    <div>
      <h2>Books</h2>
      <div>in genre <b>{genre}</b></div>
      <BookList books={books.filter(book => genre === 'all'? true : book.genres.includes(genre))}/>
      <GenreFilter setGenre={setGenre} genres={genres}/>
    </div>
  )
}

export default Books
