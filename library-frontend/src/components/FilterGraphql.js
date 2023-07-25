










// importing query
import { FINDBOOKWITHGENRES } from "../queries/qraphQLQueries"

// importing useQuery
import { useQuery } from "@apollo/client"




const FilterGraphql = ({genreProp}) => {

    console.log('inside FilterGraphql')
    console.log('this is genre', genreProp, 'typeof genre', typeof genreProp)




    // using query
    const resultBooks = useQuery(FINDBOOKWITHGENRES, {
        variables: {
            genres: genreProp
        }
    })

    console.log('here')
    console.log('resultBooks', resultBooks)
    if (resultBooks.data !== undefined) {
        const data = resultBooks.data
        if (data.findBookWithGenres !== '') {

            return (
    
                <div>
                    {data.findBookWithGenres.map(b => 
                        <div>Title {b.title}, Author {b.author}, Genres {b.genres}</div>
    
                    )}
    
                </div>
    
            )
    }
}

}


export default FilterGraphql






















