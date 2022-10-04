import { useQuery } from '@apollo/client'
import { ALL_AUTHORS } from '../queries'
import UpdateAuthorForm from './UpdateAuthorForm'

const Authors = (props) => {
  const result = useQuery(ALL_AUTHORS)

  if (!props.show) {
    return null
  }
  if(result.loading)
    return <div>loading...</div>

  const byBornYearDesc = (a,b) => b.born - a.born
  const authors = result.data.allAuthors.slice().sort(byBornYearDesc)

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {authors.map((a) => (
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <UpdateAuthorForm authors= {authors}/>
    </div>
  )
}

export default Authors
