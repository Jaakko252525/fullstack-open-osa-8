


import { useState } from "react"

import { useMutation } from "@apollo/client"
import { EditAuthor } from "../queries/qraphQLQueries"

const Authors = ({authorsProps}) => {
  const [name, setName] = useState('elon munsk')
  const [setBornTo, setBornState] = useState(15)


  const [ editAuthor ] = useMutation(EditAuthor)

  const submit = async (event) => {
    event.preventDefault()

    console.log('name', name)
    console.log('born', setBornTo, typeof setBornTo)

    editAuthor({ variables: {
      name,
      setBornTo
    }

    })

  

  setName('')
  setBornState('')
  }

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {authorsProps.allAuthors.map((a) => (
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        <form onSubmit={submit}>
          name <input
                value={name}
                onChange={({ target }) => setName(target.value)}
               />
          <br/>
          born <input
                value={setBornTo}
                onChange={({ target }) => setBornState(parseInt(target.value))}
               />
          <button type="submit">Update author</button>
        </form>
      </div>
    </div>
  )
}

export default Authors
