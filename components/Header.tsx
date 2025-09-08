'use client'

import { useSession, signIn, signOut } from 'next-auth/react'
import Image from 'next/image'

export default function Header() {
  const { data: session, status } = useSession()

  return (
    <header className="border-b border-gray-200 p-4">
      <div className="flex justify-between items-center max-w-7xl mx-auto">
        <h1 className="text-xl font-semibold">Promptshop</h1>
        
        <div className="flex items-center gap-4">
          {status === 'loading' ? (
            <div>Loading...</div>
          ) : session ? (
            <div className="flex items-center gap-2">
              {session.user?.image && (
                <Image
                  src={session.user.image}
                  alt="Profile"
                  width={32}
                  height={32}
                  className="rounded-full"
                />
              )}
              <span className="text-sm">{session.user?.name}</span>
              <button 
                onClick={() => signOut()}
                className="text-sm text-gray-600 hover:text-gray-800"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <button
              onClick={() => signIn('google')}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Sign In with Google
            </button>
          )}
        </div>
      </div>
    </header>
  )
}