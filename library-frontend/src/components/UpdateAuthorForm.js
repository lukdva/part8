import React from "react";
import { useState } from "react";
import { CHANGE_AUTHOR, ALL_AUTHORS } from "../queries";
import { useMutation } from "@apollo/client";

const UpdateAuthorForm = ({authors}) => { 
    const [name, setName] = useState(authors.at(0)? authors.at(0).name : '')
    const [born, setBorn] = useState('')
    const [changeAuthor] = useMutation(CHANGE_AUTHOR, { refetchQueries: [{ query: ALL_AUTHORS }] })

    const handleSubmit = (e) => {
        e.preventDefault();
        changeAuthor({ variables: { name, born:parseInt(born)}})
        setName('')
        setBorn('')
    }
    return (
        <>
            <h3>Set birthyear</h3>
            <form onSubmit = {handleSubmit}>
                <select value={name} onChange={({target}) => setName(target.value)}>
                    {
                        authors.map( author => <option key={author.name} value={author.name}> {author.name}</option> )
                    }
                </select>
                <div>born <input name='born' value={born} onChange={({target}) => setBorn(target.value)}></input></div>
                <button type='submit'>update author</button>
            </form>
        </>
    )
}

export default UpdateAuthorForm