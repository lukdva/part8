import { useDebugValue, useState } from "react"
import { LOGIN } from "../queries";
import { useMutation } from "@apollo/client";

const Login = ({show, setToken, setPage}) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [doLogin] = useMutation(LOGIN);
    

    const submit = async (e) => {
        e.preventDefault()
        console.log(username)
        console.log(password)
        const {data} = await doLogin({variables: {username, password}})
        const token = data.login.value
        setToken(token)
        localStorage.setItem('user-token', token)
        setPage('authors')
    }

    if (!show) {
        return null
      }

    return (
        <>
        <form onSubmit={submit}>
            <div>
                name
                <input
                    value={username}
                    onChange = {(event) => setUsername(event.target.value)}
                />
            </div>
            <div>
                password
                <input
                    value={password}
                    onChange = {({target}) => setPassword(target.value)}
                    type="password"
                />
            </div>
            <button type="submit">login</button>
        </form>
        </>
    )
}

export default Login