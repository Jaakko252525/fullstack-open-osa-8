























import { useState, useEffect } from 'react'
import { useQuery } from '@apollo/client'

import { FINDBOOKWITHGENRES } from '../queries/qraphQLQueries'

// importing graphql

const Genret = () => {
    // state for genre
    const [genre, setGenre] = useState('programming')


    // making the query variable
    const findBookWithGenres = useQuery(FINDBOOKWITHGENRES)

    // hardcoding genres
    const findBooks = () => {
        
        findBookWithGenres()
    }

 


    return (
      <div>
            <div>
                <button onClick={findBooks}>
                    {genre}
                </button>
            </div>
      </div>
    )
}

export default Genret



















