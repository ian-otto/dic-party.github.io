"use client";

import Image from 'next/image'
import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { library } from "@fortawesome/fontawesome-svg-core"
import { faBell, faSkull } from "@fortawesome/free-solid-svg-icons"
import { Input, Spacer } from '@nextui-org/react'

library.add(faBell)
library.add(faSkull)

export interface RegisterProps {
  onSubmit(username: string, password: string): void
}

export default function Register(props: RegisterProps) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [invalidPass, setInvalidPass] = useState(false)

  const submit = (e: any) => {
    e.preventDefault()
  
    if(username && password && !invalidPass) {
      props.onSubmit(username, password)
    }
  }

  const onPasswordChange = (e: any) => {
    let pass = e.target.value
    setPassword(pass)
    if(pass.indexOf(":") !== -1) {
      setInvalidPass(true)
      return
    }

    setInvalidPass(false)
  }

  return (
    <>
      <form className="flex flex-col gap-4">
        <h1 className="font-serif text-peach text-4xl">Register</h1>
        {invalidPass ? 
          <b>Invalid character in password (:)</b>
          :
          ""
        }
        <Input labelPlaceholder="username" onChange={e => {setUsername(e.target.value)}} />
        <Spacer y={1} />
        <Input.Password
          labelPlaceholder="password"
          onChange={onPasswordChange} 
        />
        <input type="submit" value="" onClick={e => submit(e)} />
      </form>
    </>
  )
}
