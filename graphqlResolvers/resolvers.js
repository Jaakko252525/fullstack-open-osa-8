

const { GraphQLError } = require('graphql')
// importing jsonwebtoken
const jwt = require('jsonwebtoken')
// importing schemas
const Author = require('../models/authorSchema')
const Book = require('../models/bookSchema')
const User = require('../models/userSchema')


const { PubSub } = require('graphql-subscriptions')
const pubsub = new PubSub()






// graphql resolvers
const resolvers = {
    Query: {
      bookCount: async () => Book.collection.countDocuments(),
      authorCount: () => Author.collection.countDocuments(),
  
      allBooks: async (root, args) => {
        console.log('inside allBooks')
        if (args.author) {
          console.log('here')
          return Book.collection.filter(book => book.author === args.author);
        }
        else if (args.genre) {
          console.log('here2')
          return Book.collection.filter(book => book.genres.includes(args.genre))
        }
        else if (args.author) {
          console.log('here3')
          return Book.collection.filter(book => book.author === args.author)
        }
  
  
        console.log('here3')
        
        return Book.find({});
      },
  
      authorsBooks: async (root, args) => {
        console.log('inside authorsBooks')
        console.log('args', args)
  
        const data = Book.collection.find({author: 'Jaakko'})
  
        console.log('data', data)
  
        return sii
  
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
      },
  
  
      findBookWithGenres: async (root, args) => {
  
  
        try {
          console.log('inside findBookWithGenres')
  
          // if args === '' return all
          if (args.genres === '') {
  
            // books from DB
            const books = await Book.find({})
            return books
          }
  
  
          const bookArray = []
  
          // getting books from DB
          const books = await Book.find({})
  
          // putting books to array
          allBooks = books
  
          // cunter and empty arrray
          let count = 0
          const correctBooks = []
  
          // while loop to put correct books that have args.genre
          while (count < allBooks.length) {
            
            if (allBooks[count].genres.includes(args.genres)) {
              correctBooks.push(allBooks[count])
            }
            count++
          }
  
          console.log('correctBooks', correctBooks)
          return correctBooks
  
        } catch (error) {
          // Handle any errors that might occur during the process
          console.error('Error finding books:', error);
          throw error; // You can choose to throw the error or return an error message
        }
        
      }
  
    },
  
  
  
  
    Mutation: {
  
      addBook: async (root, args) => {
        
        console.log('inside addBook')
        console.log('current user', args)
        // book object
        const book = new Book({
          title: args.title,
          published: args.published,
          author: "unknown",
          genres: args.genres,
        })
  
        // error if too short title, author or published is wrong
        if (args.title.length < 5) {
          
          throw new GraphQLError('title too short')
        }
        /*
        else if (args.author.length < 5) {
          throw new GraphQLError('author too short, got to bee min.185cm')
        }*/
  
  
        console.log('this is book', book)
        pubsub.publish('BOOK_ADDED', { bookAdded: book })

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
      editAuthor: async (root, args) => {
  
        console.log('inside editAuthor')
  
    
  
        // finding specific author from DB
        const author = Author.find(a => a.name === args.name)
  
  
        console.log('author', author)
        // if dont find author
        if (!author) {
          return null
        }
        
        // auhtor object
        const updatedAuthor = {
          name: args.name,
          born: args.setBornTo
        }
  
        authors = Author.map(a => a.name === args.name ? updatedAuthor : a)
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
      Subscription: {
        bookAdded: {
          subscribe: () => pubsub.asyncIterator('BOOK_ADDED')
        },
      },
    }

    

    module.exports = resolvers

