







import { useState } from 'react'

import { useMutation } from '@apollo/client'
import { ALL_BOOKS, CREATE_BOOK, FINDBOOKWITHGENRES } from '../queries/qraphQLQueries'


const NewBook = (props) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [published, setPublished] = useState(0)
  const [genre, setGenre] = useState('')
  const [genres, setGenres] = useState([])


  const [ createBook ] = useMutation(CREATE_BOOK, {
    refetchQueries: [  {query: ALL_BOOKS,FINDBOOKWITHGENRES } ],
    onError: (error) => {
      const errors = error.graphQLErrors[0].extensions.error.errors
      const messages = Object.values(errors).map(e => e.message).join('\n')
    }
  })

  



  // submit
  const submit = async (event) => {
    event.preventDefault()

    const object = {
      title: title,
      published: published,
      genres: genres
    }
    console.log('object', object)


    console.log('add book...')
    createBook({  variables: { title, published, genres } })

    setTitle('')
    setPublished(0)
    setAuthor('')
    setGenres([])
    setGenre('')


  }



  // adding genres to state
  const addGenre = () => {
    setGenres(genres.concat(genre))
    setGenre('')
  }

  return (
    <div>
      <form onSubmit={submit}>
        <div>
          title
          <input
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
          author
          <input
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
          />
        </div>
        <div>
          published
          <input
            type="number"
            value={published}
            onChange={({ target }) => setPublished(parseInt(target.value))}
          />
        </div>
        <div>
          <input
            value={genre}
            onChange={({ target }) => setGenre(target.value)}
          />
          <button onClick={addGenre} type="button">
            add genre
          </button>
        </div>
        <div>genres: {genres.join(' ')}</div>
        <button type="submit">create book</button>
      </form>
    </div>
  )
}

export default NewBook