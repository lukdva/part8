const { ApolloServer } = require('@apollo/server')
const { startStandaloneServer } = require('@apollo/server/standalone')
const mongoose = require('mongoose')
const {MONGO_URI} = require('./config')
const jwt = require('jsonwebtoken')
const typeDefs = require('./schema')
const resolvers = require('./resolvers')

require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET

mongoose.connect(MONGO_URI)
.then(() => {
    console.log('connected to mongoDB')
})
.catch(err => {
    console.log('error connecting to MongoDB: ', err);
})

const server = new ApolloServer({
  typeDefs,
  resolvers})

  startStandaloneServer(server, {
    listen: { port: 4000 },
    context: async ({req}) => {
      const auth = req ? req.headers.authorization : null
      if (auth && auth.toLowerCase().startsWith('bearer ')) {
        const decodedToken = jwt.verify(
          auth.substring(7), JWT_SECRET
        )
        const currentUser = await User.findById(decodedToken.id)
        return { currentUser }
      }
    },
  }).then(({ url }) => {
    console.log(`Server ready at ${url}`)
  })