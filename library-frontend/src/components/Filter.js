




















const Filter = ({booksProps, genreProp}) => {


    console.log('inside Filter component!')
    console.log('genre is', genreProp)
    console.log('booksProp is', booksProps)

    if (genreProp === '') {
        return null
    }

    else if (genreProp !== '') {
        console.log('inside useEffect if statement')
        const books = booksProps.allBooks.filter(book => book.genres.includes(genreProp))
        console.log('books that has genre', books)


        return (
            <div>
                <h1>books filtered "{genreProp}"</h1>
                <table>
                <tbody>
                <tr>
                    <th></th>
                    <th>author</th>
                    <th>published</th>
                </tr>
                {books.map((a) => (
                    <tr key={a.title}>
                    <td>{a.title}</td>
                    <td>{a.author}</td>
                    <td>{a.published}</td>
                    </tr>
                ))}
                </tbody>
            </table>
            </div>

        )}


}




export default Filter





















