"use client";

import Image from 'next/image'
import { Loading } from '@nextui-org/react'
import { useState, useEffect, useRef } from 'react'

export interface LoginProps {
  onSubmit(password: string): void
}

export default function Login(props: LoginProps) {
  const [password, setPassword] = useState<string>("")
  const [canSubmit, setCanSubmit] = useState<boolean>(true)
  const inputRef = useRef<any>(null)

  const submitPassword = (e: any) => {
    e.preventDefault()
    if(!canSubmit) return
    setCanSubmit(false)
    props.onSubmit(password)
    setTimeout(() => setCanSubmit(true), 3000)
  }

  useEffect( () => {
    if(inputRef) {
      inputRef?.current?.focus()
    }
  })

  return (
    <>
      <h1 className="font-serif text-peach text-4xl">Welcome back, friend.</h1>
      <p className="font-serif text-lg">Enter your password to access the DiC party suite doorbell.</p>
      <form className="flex flex-col gap-4">
        <input type="password" disabled={!canSubmit} ref={inputRef} onChange={e => (setPassword(e.target.value))} placeholder="You remember it, right?" className="bg-transparent border-0 border-b-2 border-b-periwinkle focus:border-b-mint !outline-none font-sans pb-1" />
        <input type="submit" disabled={!canSubmit} value="" onClick={e => submitPassword(e)} />
        {canSubmit ? null : <Loading/>}
      </form>
    </>
  )
}
