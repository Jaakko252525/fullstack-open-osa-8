













const { v1: uuid } = require('uuid')

const { ApolloServer } = require('@apollo/server')
const { startStandaloneServer } = require('@apollo/server/standalone')


// importing graphql error
const { GraphQLError } = require('graphql')



// importing jsonwebtoken
const jwt = require('jsonwebtoken')


//importing shit
const mongoose = require('mongoose')
mongoose.set('strictQuery', false)

// importing schemas
const Author = require('./models/authorSchema')
const Book = require('./models/bookSchema')
const User = require('./models/userSchema')



// .env and its variables
require('dotenv').config()
const MONGODB_URI = process.env.MONGODB_URI
console.log('connecting to MONGODB_URI')


// connecting to database
mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('connected to MONGODB')
  })
  .catch((error) => {
    console.log('error connection to MongoDB:', error.message)
  })



// graphql schemas
const typeDefs = `
  type Author {
    name: String
    id: ID
    born: Int
    bookCount: Int
  }

  type Book {
    title: String!
    published: Int!
    author: Author!
    genres: [String!]!
    id: ID!
  }


  type Mutation {
    addBook(
      title: String!
      author: String!
      published: Int
      genres: [String]
     ): Book 

    addAuthor(
      name: String!
      born: Int
    ): Author

    editAuthor(
      name: String!
      setBornTo: Int
    ): Author
    }




  type User {
    username: String!
    favoriteGenre: String!
    books: [String]
    id: ID!
  }
  
  type Token {
    value: String!
  }
  
  type Query {
    me: User
  }
  
  type Mutation {
    createUser(
      username: String!
      favoriteGenre: String!
    ): User
    login(
      username: String!
      password: String!
    ): Token
  
  
  }


  type Query {
    bookCount: Int!
    authorCount: Int!
    allBooks(author: String, genre: String): [Book!]!
    allAuthors: [Author!]!
    Author: String!
  }
`
// graphql resolvers
const resolvers = {
  Query: {
    bookCount: async () => Book.collection.countDocuments(),
    authorCount: () => Author.collection.countDocuments(),

    allBooks: async (root, args) => {
      console.log('inside allBooks')
      if (args.author) {
        return Book.collection.filter(book => book.author === args.author);
      }
      else if (args.genre) {
        return Book.collection.filter(book => book.genres.includes(args.genre))
      }



      
      return Book.find({});
    },

    allAuthors: async (root, args) => {
      return Author.find({})
    },
    Author: async (root, args) => {
      const object = {
        name: root.name,
        id: root.id,
        born: root.born,
    }
      /*
      bookCount: (root) => {
      const b = books.filter(book => book.author === root.name)
      return b.length
      */
    }
  },




  Mutation: {
    addBook: async (root, args) => {

      // error if too short title, author or published is wrong
      if (args.title.length < 5) {
        
        throw new GraphQLError('title too short')
      }
      else if (args.author.length < 5) {
        throw new GraphQLError('author too short, got to bee min.185cm')
      }
      console.log('insid addBook')
      const book = new Book({
        title: args.title,
        published: args.published,
        author: args.author,
        genres: args.genres
      })
      return book.save()

    },
    addAuthor: async (root, args) => {
      console.log('adding author!')

      const author = new Author({
        name: args.name,
        born: args.born
      })
      return author.save()
    },
    editAuthor: (root, args) => {

      console.log('editAuthor', args)

      const author = authors.find(a => a.name === args.name)
      if (!author) {
        return null
      }
      console.log('author', author)
      const updatedAuthor = { ...author, born: args.setBornTo }
      authors = authors.map(a => a.name === args.name ? updatedAuthor : a)
      return updatedAuthor
    },


    
    createUser: async (root, args) => {
      const user = new User({ username: args.username })
      console.log('creating user')
  
      return user.save()
        .catch(error => {
          throw new GraphQLError('Creating the user failed', {
            extensions: {
              code: 'BAD_USER_INPUT',
              invalidArgs: args.name,
              error
            }
          })
        })
    },
    login: async (root, args) => {
      console.log('logging in')
      const user = await User.findOne({ username: args.username })


  
      if ( !user || args.password !== 'secret' ) {
        console.log('in error!')
        throw new GraphQLError('wrong credentials', {
          extensions: {
            code: 'BAD_USER_INPUT'
          }
        })        
      }
  
      const userForToken = {
        username: user.username,
        id: user._id,
      }

  
      return { value: jwt.sign(userForToken, process.env.JWT_SECRET) }
    },
    },
  }




const server = new ApolloServer({
  typeDefs,
  resolvers,
})

startStandaloneServer(server, {
  listen: { port: 4000 },
}).then(({ url }) => {
  console.log(`Server ready at ${url}`)
})










