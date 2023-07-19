













const { v1: uuid } = require('uuid')

const { ApolloServer } = require('@apollo/server')
const { startStandaloneServer } = require('@apollo/server/standalone')


// importing graphql error
const { GraphQLError } = require('graphql')


let authors = [
  {
    name: 'Robert Martin',
    id: "afa51ab0-344d-11e9-a414-719c6709cf3e",
    born: 1952,
  },
  {
    name: 'Martin Fowler',
    id: "afa5b6f0-344d-11e9-a414-719c6709cf3e",
    born: 1963
  },
  {
    name: 'Fyodor Dostoevsky',
    id: "afa5b6f1-344d-11e9-a414-719c6709cf3e",
    born: 1821
  },
  { 
    name: 'Joshua Kerievsky', // birthyear not known
    id: "afa5b6f2-344d-11e9-a414-719c6709cf3e",
  },
  { 
    name: 'Sandi Metz', // birthyear not known
    id: "afa5b6f3-344d-11e9-a414-719c6709cf3e",
  },
]

/*
 * Suomi:
 * Saattaisi olla järkevämpää assosioida kirja ja sen tekijä tallettamalla kirjan yhteyteen tekijän nimen sijaan tekijän id
 * Yksinkertaisuuden vuoksi tallennamme kuitenkin kirjan yhteyteen tekijän nimen
 *
 * English:
 * It might make more sense to associate a book with its author by storing the author's id in the context of the book instead of the author's name
 * However, for simplicity, we will store the author's name in connection with the book
 *
 * Spanish:
 * Podría tener más sentido asociar un libro con su autor almacenando la id del autor en el contexto del libro en lugar del nombre del autor
 * Sin embargo, por simplicidad, almacenaremos el nombre del autor en conección con el libro
*/

let books = [
  {
    title: 'Clean Code',
    published: 2008,
    author: 'Robert Martin',
    id: "afa5b6f4-344d-11e9-a414-719c6709cf3e",
    genres: ['refactoring']
  },
  {
    title: 'Agile software development',
    published: 2002,
    author: 'Robert Martin',
    id: "afa5b6f5-344d-11e9-a414-719c6709cf3e",
    genres: ['agile', 'patterns', 'design']
  },
  {
    title: 'Refactoring, edition 2',
    published: 2018,
    author: 'Martin Fowler',
    id: "afa5de00-344d-11e9-a414-719c6709cf3e",
    genres: ['refactoring']
  },
  {
    title: 'Refactoring to patterns',
    published: 2008,
    author: 'Joshua Kerievsky',
    id: "afa5de01-344d-11e9-a414-719c6709cf3e",
    genres: ['refactoring', 'patterns']
  },  
  {
    title: 'Practical Object-Oriented Design, An Agile Primer Using Ruby',
    published: 2012,
    author: 'Sandi Metz',
    id: "afa5de02-344d-11e9-a414-719c6709cf3e",
    genres: ['refactoring', 'design']
  },
  {
    title: 'Crime and punishment',
    published: 1866,
    author: 'Fyodor Dostoevsky',
    id: "afa5de03-344d-11e9-a414-719c6709cf3e",
    genres: ['classic', 'crime']
  },
  {
    title: 'The Demon ',
    published: 1872,
    author: 'Fyodor Dostoevsky',
    id: "afa5de04-344d-11e9-a414-719c6709cf3e",
    genres: ['classic', 'revolution']
  },
]

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
    authorCount: () => authors.length,

    allBooks: (root, args) => {
      if (args.author) {
        return books.filter(book => book.author === args.author);
      }
      else if (args.genre) {
        return books.filter(book => book.genres.includes(args.genre))
      }
      return books;
    },

    allAuthors: () => authors,
  },
  Book: {
    title: (root) => root.title,
    published: (root) => root.published,
    author: (root) => root.author,
    id: (root) => root.id,
    genres: (root) => root.genres
  },
  Author: {
    name: (root) => root.name,
    id: (root) => root.id,
    born: (root) => {
      return root.born},

    bookCount: (root) => {
      const b = books.filter(book => book.author === root.name)
      return b.length
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
      const user = await User.findOne({ username: args.username })
      console.log('logging in')
  
      if ( !user || args.password !== 'secret' ) {
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










