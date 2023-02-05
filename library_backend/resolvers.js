const { GraphQLError } = require('graphql')
const { PubSub } = require('graphql-subscriptions')
const Author = require('./models/author')
const User = require('./models/user')
const Book = require('./models/book')
const jwt = require('jsonwebtoken')

require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET;
const pubsub = new PubSub()

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
        throw new GraphQLError("not authenticated")
      }

      let author = await Author.findOne({name: args.author})
      if(!author){
        const newAuthor = new Author({name: args.author})
        try {
          author = await newAuthor.save()
        } catch (error) {
          throw new GraphQLError(error.message, {
            extensions: {
              code: 'BAD_USER_INPUT',
              invalidArgs: args.name,
              error
            }
          })
        }
      }
      const book = new Book({...args, author:author._id})
      let bookResult;
      
      try {
        bookResult = await book.save()
      } catch (error) {
        throw new GraphQLError(error.message, {
            extensions: {
              code: 'BAD_USER_INPUT',
              invalidArgs: args.name,
              error
            }
          })
      }
      const populatedResult = await bookResult.populate('author')
      
      pubsub.publish('BOOK_ADDED', {bookAdded: populatedResult})

      return populatedResult
    },
    editAuthor: async (root, args, context) => {
      const currentUser = context.currentUser
      if (!currentUser) {
        throw new GraphQLError("not authenticated", {
            extensions: {
                code: 'BAD_USER_INPUT'
              }
        })
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
        throw new GraphQLError("wrong credentials", {
            extensions: {
                code: 'UNAUTHENTICATED'
              }
        })
      }
      const userForToken = {
        username: user.username,
        id: user._id,
      }
      return { value: jwt.sign(userForToken, JWT_SECRET) }
    }
  },
  Subscription: {
    bookAdded: {
        subscribe: () => pubsub.asyncIterator('BOOK_ADDED')
    }
  }
}
module.exports = resolvers