



import { gql } from '@apollo/client'






// query for getting all authors
export const ALL_AUTHORS = gql`
  query {
    allAuthors {
      name
      born
      bookCount
    }
  }
`

// query for getting all books
export const ALL_BOOKS = gql`
  query {
    allBooks {
      title
      genres
    }
  }
`


// findBookWithGenres
export const FINDBOOKWITHGENRES = gql`
  query($genres: String!) {
    findBookWithGenres(genres: $genres) {
      title
      genres
    }
  }

`

// authorBooks
export const AUTHORS_BOOKS = gql`
  query($author: String!) {
    authorsBooks(author: $author) {
      author {
        name
      }
    }
  }


`



/*
export const FIND_PERSON = gql`
  query findPersonByName($nameToSearch: String!) {
    // ...
  }
`

*/



// mutation for creating book
export const CREATE_BOOK = gql`
  mutation createBook($title: String!, $published: Int!, $genres: [String!]!) 
  {
  addBook (title: $title, published: $published, genres: $genres) {
    title
    published
    genres
  }
  }
`


// mutation for editing author 
export const EditAuthor = gql`
  mutation EditAuthor($name: String!, $setBornTo: Int!) {
    editAuthor(name: $name, setBornTo: $setBornTo) {
      name: name
      setBornTo: setBornTo
    }
  }
`


// mutation for loggin in
export const LOGIN = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password)  {
      value
    }
  }
`




