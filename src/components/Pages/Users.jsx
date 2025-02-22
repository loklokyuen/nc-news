import { use, useContext, useEffect, useState } from "react";
import { UserAccount } from "../../contexts/UserAccount";
import { getUserInfoByUsername } from "../../api";
import { useParams } from "react-router";
import Loader from "../Common/Loader";;

export default function Users({ setActivePage}) {
    const [user, setUser] = useState(null);
    const { loggedInUser } = useContext(UserAccount);
    const [isError, setIsError] = useState(false)
    const [loading, setLoading] = useState(true)
    const [message, setMessage] = useState('')
    const params = useParams();
    const username = params.username;

    useEffect(()=>{
        setActivePage('users');
        setLoading(true)
        setIsError(false)
        setMessage('')
        getUserInfoByUsername(username)
        .then(({ user })=>{
            setLoading(false)
            setUser(user)
        })
        .catch((err)=>{
            setLoading(false)
            setIsError(true)
            const errorMessage = err.response?.data?.msg || 'Something went wrong! Unable to fetch user, please try again later.'
            setMessage(errorMessage)
        })
    }, [username])
    if (loading) return <Loader/>;
    if (isError && !user) return <div className="not-found">{message}</div>
    return <section>
        <img src={user.avatar_url} alt={user.username + " avatar"} className="rounded-full h-24 w-24 mx-auto mt-4"/>
        <h2 className="title m-2">{user.username}</h2>
        <p className="text-center text-green-kelp-600 text-xl font-light">{username === loggedInUser? "Hi " : "Name: "} {user.name}</p>
    </section>
}