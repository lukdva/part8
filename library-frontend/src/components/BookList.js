import { useQuery } from '@apollo/client'
import { ALL_BOOKS } from '../queries'

const BookList = ({filters}) => {

const result = useQuery(ALL_BOOKS, {
    variables: filters
})
  if(result.loading)
    return <div>loading...</div>

  const books = result.data.allBooks

  return (
    <div>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {books.map((a) => (
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default BookList
