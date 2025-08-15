"use client"
import { useSession,signOut } from "next-auth/react"

export default function User2() {
    const { data: session, status } = useSession()
    console.log(session);
    console.log(status);
    return (
        <>
            <h1>
                userpage
            </h1>
            <button onClick={()=>{signOut()}}>sign out</button>
        </>
    )
}