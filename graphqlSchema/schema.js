























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

    addBook(
      title: String!
      author: String
      published: Int!
      genres: [String]!
     ): Book 

    addAuthor(
      name: String!
      born: Int
    ): Author

    editAuthor(
      name: String!
      setBornTo: Int!
    ): Author
    }
  
  fragment AuthorDetails on Author {
    name
    born
  }

  type Query {
    bookCount: Int!
    authorCount: Int!
    allBooks(author: String, genre: String): [Book!]!
    allAuthors: [Author!]!
    Author: String!

    authorsBooks(author: String!, genre: String): [Book!]!

    findBookWithGenres(
      genres: String!
    ): [Book!]!
  }


  type Subscription {
    bookAdded: Book!
  }    




`




module.exports = typeDefs












