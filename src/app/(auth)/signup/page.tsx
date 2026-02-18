// 'use client'

import SignupForm from "./Signup";

// import React from 'react'
// import { authClient } from '@/lib/auth-client'

// function Page() {
//   const [email, setEmail] = React.useState('')
//   const [password, setPassword] = React.useState('')
//   const [msg, setMsg] = React.useState('')

//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault()

//     setMsg('') // clear previous message

//     const { data, error } = await authClient.signUp.email({
//       name: email.split('@')[0], // simple default name
//       email,
//       password,
//     })
    

//     if (error) {
//       console.error('Error signing up:', error)
//       setMsg(error.message || 'An error occurred during sign-up.')
//     } else {
//       console.log('Sign-up successful:', data)
//       setMsg('Sign-up successful! Please check your email.')
//     }
//   }

//   return (
//     <div className="flex flex-col gap-4 max-w-sm">
//       {msg && <p>{msg}</p>}

//       <form onSubmit={handleSubmit} className="flex flex-col gap-2">
//         <input
//           type="email"
//           placeholder="Email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           required
//         />

//         <input
//           type="password"
//           placeholder="Password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           required
//         />

//         <button type="submit">Sign up</button>
//       </form>
//     </div>
//   )
// }


export default function SignupPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <SignupForm />
    </div>
  );
}
