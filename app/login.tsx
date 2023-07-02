"use client";

import Image from 'next/image'
import { useState } from 'react'

export interface LoginProps {
  onSubmit: (string) => void;
}

export default function Login(props: LoginProps) {
  const [password, setPassword] = useState()

  const submitPassword = (e: any) => {
    e.preventDefault()
    console.log(password)
    props.onSubmit(password)
  }

  return (
    <form>
      <span>Enter Password</span>
      <input type="password" onChange={e => (setPassword(e.target.value))} />
      <input type="submit" value="submit" onClick={e => submitPassword(e)} />
    </form>
  );
}
