import { useQuery } from '@apollo/client'
import { useState } from 'react'
import { ALL_BOOKS } from '../queries'
import GenreFilter from './GenreFilter'

const Books = (props) => {
  const [genre, setGenre] = useState('all')
  const result = useQuery(ALL_BOOKS)
  if (!props.show) {
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
      <h2>books</h2>

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {books.filter(book => genre === 'all'? true : book.genres.includes(genre)).map((a) => (
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <GenreFilter setGenre={setGenre} genres={genres}/>
    </div>
  )
}

export default Books
