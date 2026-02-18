import SigninForm from "./Signin";

export default function SigninPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <SigninForm />
    </div>
  );
}

// 'use client'

// import React, { useState } from "react"
// import { Eye, EyeOff, Mail, Lock } from "lucide-react"

// export default function SignInPage() {
//   const [email, setEmail] = useState("")
//   const [password, setPassword] = useState("")
//   const [showPassword, setShowPassword] = useState(false)
//   const [loading, setLoading] = useState(false)
//   const [error, setError] = useState("")

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault()

//     if (!email || !password) {
//       setError("Email and password are required")
//       return
//     }

//     setError("")
//     setLoading(true)

//     // simulate login
//     setTimeout(() => {
//       setLoading(false)
//       console.log({ email, password })
//       alert(`Signed in as ${email}`)
//     }, 1500)
//   }

//   const handleGoogleSignIn = () => {
//     setLoading(true)
//     setTimeout(() => {
//       setLoading(false)
//       alert("Google sign-in initiated")
//     }, 1500)
//   }

//   return (
//     <div className="min-h-screen bg-background flex items-center justify-center px-4">
//       <div className="w-full max-w-sm">
//         {/* Header */}
//         <div className="text-center mb-8">
//           <h1 className="text-2xl font-semibold text-foreground mb-2">
//             Welcome to Flaggy
//           </h1>
//           <p className="text-sm text-muted-foreground">
//             Rollback your features by our system
//           </p>
//         </div>

//         {/* Card */}
//         <div className="bg-card rounded-xl p-6">
//           {/* Google */}
//           <button
//             onClick={handleGoogleSignIn}
//             disabled={loading}
//             className="w-full bg-white hover:bg-secondary border border-border rounded-lg py-2.5 px-3 text-sm font-medium flex items-center justify-center gap-2 disabled:opacity-50"
//           >
//             <svg className="w-4 h-4" viewBox="0 0 24 24">
//               <path
//                 fill="currentColor"
//                 d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
//               />
//               <path
//                 fill="currentColor"
//                 d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
//               />
//               <path
//                 fill="currentColor"
//                 d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22z"
//               />
//               <path
//                 fill="currentColor"
//                 d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
//               />
//             </svg>
//             Continue with Google
//           </button>

//           {/* Divider */}
//           <div className="flex items-center gap-3 my-4">
//             <div className="flex-1 h-px bg-border" />
//             <span className="text-xs text-muted-foreground">or</span>
//             <div className="flex-1 h-px bg-border" />
//           </div>

//           {/* Form */}
//           <form onSubmit={handleSubmit} className="space-y-4">
//             {/* Email */}
//             <div>
//               <label className="block text-xs font-medium mb-1">Email</label>
//               <div className="relative">
//                 <Mail className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
//                 <input
//                   type="email"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   placeholder="your@email.com"
//                   className="w-full pl-9 pr-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-primary/20"
//                 />
//               </div>
//             </div>

//             {/* Password */}
//             <div>
//               <label className="block text-xs font-medium mb-1">Password</label>
//               <div className="relative">
//                 <Lock className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
//                 <input
//                   type={showPassword ? "text" : "password"}
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   placeholder="••••••••"
//                   className="w-full pl-9 pr-10 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-primary/20"
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setShowPassword(!showPassword)}
//                   className="absolute right-3 top-2.5 text-muted-foreground"
//                 >
//                   {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
//                 </button>
//               </div>
//             </div>

//             {error && <p className="text-xs text-destructive">{error}</p>}

//             <button
//               type="submit"
//               disabled={loading}
//               className="w-full bg-primary text-primary-foreground py-2 rounded-lg text-sm font-medium disabled:opacity-50"
//             >
//               {loading ? "Signing in..." : "Sign in"}
//             </button>
//           </form>
//         </div>
//       </div>
//     </div>
//   )
// }
