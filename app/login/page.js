"use client"
import { signIn } from "next-auth/react"
export default function Login() {
    return (
        <>
            <h1 className="bg-primary">loging page</h1>
            <button onClick={() => {
                signIn('google');
            }}>log in</button>
        </>
    )
}