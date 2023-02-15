import { gql } from '@apollo/client'

export const ALL_AUTHORS = gql`
query {
    allAuthors {
        name
        born
        bookCount
    }
}
`
export const ALL_GENRES = gql`
query {
    allBooks {
        genres
    }
}
`
export const ALL_BOOKS = gql`
query getFilteredBooks($genre: String, $author: String) {
    allBooks(author:$author genre:$genre) {
      title
      published
      author {
        name
      }
      genres,
      id
    }
  }
`
export const CREATE_BOOK = gql`
mutation createBook(
        $title: String!
        $author: String!
        $published: Int!
        $genres: [String]!
    ) {
        addBook(title: $title, author: $author, published: $published, genres: $genres){
            title
            author {
                id
                name
                born
            }
            published
            genres
            id
        }
    }
`

export const CHANGE_AUTHOR = gql`
mutation changeAuthor(
    $name: String!
    $born: Int!
) {
    editAuthor( 
        name: $name
        setBornTo: $born
    ) {
        name
        born
    }
}
`
export const LOGIN = gql`
mutation
doLogin($username: String!, $password: String!){
  login(username: $username, password: $password) {
      value
  }
}
`

export const ME = gql`
query{
    me {
      username
      id
      favouriteGenre
    }
  }
  `

  export const BOOK_ADDED_SUBSCRIPTION = gql`
  subscription {

    bookAdded {
      title
        published
        author {
          name
        }
        genres,
        id
    }
  }
  `