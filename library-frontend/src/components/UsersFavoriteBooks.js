











// useQuery
import { useQuery } from "@apollo/client"

// querys
import { AUTHORS_BOOKS } from "../queries/qraphQLQueries"
import { ALL_BOOKS } from "../queries/qraphQLQueries"



const UsersFavoriteBooks = ({usernameProp}) => {

    console.log('usernameProp', usernameProp)

    /*
    // GET authorsBooks
    const authorsBooks= useQuery(AUTHORS_BOOKS, {
        variables: {
            author: usernameProp
        }
    })
    console.log('authorsBooks', authorsBooks.data)
    */    

    // GET all books

    const allBooks = useQuery(ALL_BOOKS)


    console.log('allBooks.data', allBooks)

    return (
        <div>
          sii
        </div>
    )
}




export default UsersFavoriteBooks











