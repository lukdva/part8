import { useQuery } from '@apollo/client'
import { GET_FILTERED_BOOKS, ME } from '../queries'
import BookList from './BookList'

const Recommendations = ({show}) => {

 
  const meResult = useQuery(ME)
  if(meResult.loading){
    return null
  }
  const favouriteGenre = meResult.data.me.favouriteGenre

  if (!show) {
    return null
  }

  return (
    <div>
      <h2>Recommendations</h2>
      <div>books in your favorite genre <b>{favouriteGenre}</b></div>
      <BookList filters={{genre: favouriteGenre}}/>
    </div>
  )
}

export default Recommendations
