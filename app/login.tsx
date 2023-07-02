"use client";

import Image from 'next/image'
import { useState } from 'react'

export interface LoginProps {
  onSubmit: (string) => void
  retry: boolean
}

export default function Login(props: LoginProps) {
  const [password, setPassword] = useState()

  const submitPassword = (e: any) => {
    e.preventDefault()
    props.onSubmit(password)
    console.log(props.retry)
  }


  return (
    <form>
      <span>{props.retry? "Invalid Password" : "Enter Password"}</span>
      <input type="password" onChange={e => (setPassword(e.target.value))} />
      <input type="submit" value="" onClick={e => submitPassword(e)} />
    </form>
  );
}
