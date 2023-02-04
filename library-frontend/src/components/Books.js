import { useQuery } from '@apollo/client'
import { useState } from 'react'
import { ALL_GENRES } from '../queries'
import GenreFilter from './GenreFilter'
import BookList from './BookList'

const Books = ({show}) => {
  const [genre, setGenre] = useState('all')
  const result = useQuery(ALL_GENRES)
  if (!show) {
    return null
  }
  if(result.loading)
    return null

  const allGenres = result.data.allBooks

  const genres = [...new Set(
    allGenres.reduce(
      (accumulation, value) => {
        return accumulation.concat(value.genres)
      }, [])
    )]

  return (
    <div>
      <h2>Books</h2>
      <div>in genre <b>{genre}</b></div>
      <BookList filters={genre==='all'? null : {genre}}/>
      <GenreFilter setGenre={setGenre} genres={genres}/>
    </div>
  )
}

export default Books
