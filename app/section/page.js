"use client"
import { useSession } from "next-auth/react"

export default function User2() {
    const { data: session } = useSession()
    console.log(session);
    return (
        <>
            <h1>
                userpage
            </h1>
        </>
    )
}