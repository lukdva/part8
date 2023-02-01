const { ApolloServer, UserInputError, AuthenticationError, gql } = require('apollo-server')
const { v1: uuid } = require('uuid')
const mongoose = require('mongoose')
const {MONGO_URI} = require('./config')
const Book = require('./models/book')
const Author = require('./models/author')
const User = require('./models/user')
const jwt = require('jsonwebtoken')
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET;

const typeDefs = gql`
  type Book {
    title: String!
    published: Int!
    author: Author!
    id: ID!
    genres: [String]!
  }

  type Author {
    name: String!
    id: ID!
    born: Int
    bookCount: Int
  }

  type User {
    username: String!
    favouriteGenre: String!
    id: ID!
  }

  type Token {
    value: String!
  }

  type Query {
    bookCount: Int!
    authorCount: Int!
    allBooks(author: String, genre: String): [Book]!
    allAuthors: [Author]!
    me: User
  }

  type Mutation {
    addBook(
      title: String!
      published: Int!
      author: String!
      genres: [String]!
    ): Book

    editAuthor(
      name: String!
      setBornTo: Int!
    ): Author

    createUser(
      username: String!
      favouriteGenre: String!
    ): User

    login(
      username: String!
      password: String!
    ): Token
  }
`

const resolvers = {
  Query: {
    bookCount: async () => {
      const result = await Book.find()
      return result.length
    },
    authorCount: async () => {
      const result = await Author.find()
      return result.length
    },
    allBooks: async (root, args) => {
      
      let filter = {}
      if(args.author)
      {
        const author = await Author.findOne({name: args.author})
        filter.author = author._id
      }
      if(args.genre)
      {
        filter.genres = { $in: [args.genre]}
        
      }
      const books = await Book.find(filter).populate('author')
      return books
    },
    allAuthors: async () => {
      let authors = await Author.find({})
      authors = authors.map( async author => {
        const books = await Book.find({author: author._id
        })
        return {...author.toObject(), bookCount: books.length}
      })
      return authors
    },
    me: async (root, args, context) => {
      return context.currentUser
    }
  },
  Mutation: {
    addBook: async (root, args, context) => {
      const currentUser = context.currentUser
      if (!currentUser) {
        throw new AuthenticationError("not authenticated")
      }

      let author = await Author.findOne({name: args.author})
      if(!author){
        const newAuthor = new Author({name: args.author})
        try {
          author = await newAuthor.save()
        } catch (error) {
          throw new UserInputError(error.message, {invalidArgs: args})
        }
      }
      const book = new Book({...args, author:author._id})
      let bookResult;
      
      try {
        bookResult = await book.save()
      } catch (error) {
        throw new UserInputError(error.message, {invalidArgs: args})
      }
      const populatedResult = await bookResult.populate('author')
      return populatedResult
    },
    editAuthor: async (root, args, context) => {
      const currentUser = context.currentUser
      if (!currentUser) {
        throw new AuthenticationError("not authenticated")
      }
      const authorToEdit = await Author.findOne({name: args.name})
      if(!authorToEdit)
        return null
      authorToEdit.born = args.setBornTo
      const result = await authorToEdit.save()
      return result
    },
    createUser: async (root, args) => {
      const user = new User({...args})
      const result = user.save();
      return result;
    },
    login: async (root,args) => {
      const user = await User.findOne({ username: args.username })

      if ( !user || args.password !== 'secret' ) {
        throw new UserInputError("wrong credentials")
      }
      const userForToken = {
        username: user.username,
        id: user._id,
      }
      return { value: jwt.sign(userForToken, JWT_SECRET) }
    }
  }
}

mongoose.connect(MONGO_URI)
.then(() => {
    console.log('connected to mongoDB')
})
.catch(err => {
    console.log('error connecting to MongoDB: ', err);
})

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({req}) => {
    const auth = req ? req.headers.authorization : null
    if (auth && auth.toLowerCase().startsWith('bearer ')) {
      const decodedToken = jwt.verify(
        auth.substring(7), JWT_SECRET
      )
      const currentUser = await User.findById(decodedToken.id)
      return { currentUser }
    }
  }
})

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`)
})