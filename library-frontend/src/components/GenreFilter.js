import { useState } from "react"


const GenreFilter = ({genres, setGenre}) => {
    return (
        <>
        {
            genres.map(genre => 
                <button onClick={(e) => setGenre(e.target.value)} key={genre} value={genre}>{genre}</button>
            )
        }
        <button onClick={(e) => setGenre(e.target.value)} value="all">all genres</button>
        </>
    )
}

export default GenreFilter