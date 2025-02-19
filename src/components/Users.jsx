import { use, useContext, useEffect, useState } from "react";
import { UserAccount } from "../contexts/UserAccount";
import { getUserInfoByUsername } from "../api";
import { useParams } from "react-router";
import Loader from "./Loader";

export default function Users({ setCurrentPage}) {
    const [user, setUser] = useState(null);
    const { loggedInUser } = useContext(UserAccount);
    const [isError, setIsError] = useState(false)
    const [loading, setLoading] = useState(true)
    const [message, setMessage] = useState('')
    const params = useParams();
    const username = params.username;

    useEffect(()=>{
        setLoading(true)
        setIsError(false)
        setMessage('')
        getUserInfoByUsername(username)
        .then(({ user })=>{
            console.log(user);
            setLoading(false)
            setUser(user)
        })
        .catch((err)=>{
            console.log(err)
            setLoading(false)
            setIsError(true)
            const errorMessage = err.response?.data?.msg || 'Something went wrong! Unable to fetch user, please try again later.'
            setMessage(errorMessage)
        })
    }, [username])
    setCurrentPage('users');
    if (loading) return <Loader/>;
    if (isError && !user) return <div className="not-found">{message}</div>
    return <section>
        <img src={user.avatar_url} alt={user.username + " avatar"} className="rounded-full h-24 w-24 mx-auto mt-4"/>
        <h2 className="text-center text-2xl font-bold text-shadow-green-600 p-2">{user.username}</h2>
        <p className="text-center text-green-kelp-600 text-xl font-light">{username === loggedInUser? "Hi " : "Name: "} {user.name}</p>
    </section>
}