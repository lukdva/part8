import { useQuery } from '@apollo/client'
import { ALL_BOOKS, ME } from '../queries'
import BookList from './BookList'

const Recommendations = ({show}) => {

  const bookResult = useQuery(ALL_BOOKS)
  const meResult = useQuery(ME)
  if (!show) {
    return null
  }
  if(bookResult.loading || meResult.loading)
    return (<div>loading...</div>)

  const favouriteGenre = meResult.data.me.favouriteGenre
  const books = bookResult.data.allBooks

  return (
    <div>
      <h2>Recommendations</h2>
      <div>books in your favorite genre <b>{favouriteGenre}</b></div>
      <BookList books={books.filter(book => book.genres.includes(favouriteGenre))}/>
    </div>
  )
}

export default Recommendations
