"use client";

import Image from 'next/image'
import { useState } from 'react'

export interface LoginProps {
  onSubmit(password: string): void
}

export default function Login(props: LoginProps) {
  const [password, setPassword] = useState<string>("")

  const submitPassword = (e: any) => {
    e.preventDefault()
    props.onSubmit(password)
  }


  return (
    <>
      <h1 className="font-serif text-peach text-4xl">Welcome back, friend.</h1>
      <p className="font-serif text-lg">Enter your password to access the DiC party suite doorbell.</p>
      <form className="flex flex-col gap-4">
        <input type="password" autoFocus onChange={e => (setPassword(e.target.value))} placeholder="You remember it, right?" className="bg-transparent border-0 border-b-2 border-b-periwinkle focus:border-b-mint !outline-none font-sans pb-1" />
        <input type="submit" value="" onClick={e => submitPassword(e)} />
      </form>
    </>
  )
}
