import React from 'react'

type Props = {
  children: React.ReactNode
}

export default function Layout({ children }: Props) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-zinc-900 to-black text-white font-sans">
      <main className="w-full max-w-4xl p-12">{children}</main>
    </div>
  )
}
