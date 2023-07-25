











// importing Genret component
import Genret from "./Genret"
import Filter from "./Filter"

import { useEffect, useState } from "react"



const Books = ({bookProps}) => {
  // state for what genre is pressed
  const [genre, setGenre] = useState('')

  console.log('bookProps', bookProps.allBooks, 'typeof', typeof bookProps.allBooks)

 

  if (genre === '') {


  return (
    <div>
      <h2>books</h2>

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {bookProps.allBooks.map((a) => (
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        <button onClick={() => setGenre("programming")}>Change filter to "programming" </button>
        <button onClick={() => setGenre("fiction")}>Change filter to "fiction" </button>
        <button onClick={() => setGenre("adventure")}>Change filter to "adventure" </button>
        <button onClick={() => setGenre("action")}>Change filter to "action" </button>
      </div>
      <Filter booksProps={bookProps} genreProp={genre}/>
    </div>
  )}

  else if (genre !== '') {
    return (
      <div>
        <Filter booksProps={bookProps} genreProp={genre} />
        <div>
        <button onClick={() => setGenre('')}>Change filter to "null"</button>
      </div>
      </div>
    )
  }
}

export default Books

















