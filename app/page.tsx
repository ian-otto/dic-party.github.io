"use client";


import Image from 'next/image'
import Login from './login'
import Ringer from './ringer'
import Register from './register'
import AdminPanel from './adminPanel'
import React, { useState, useEffect } from 'react'
import {decode as base64_decode, encode as base64_encode} from 'base-64'
import { Spacer } from '@nextui-org/react'

const API_URL = "https://7mg5vpebc4.execute-api.us-west-2.amazonaws.com"


export default function Home() {
  const [password, setPassword] = useState("")
  const [loggedIn, setLoggedIn] = useState(false)
  const [registering, setRegistering] = useState(false)
  const [uid, setUid] = useState("")
  const [userInfo, setUserInfo] = useState(null)
  const [doorbellLoading, setDoorbellLoading] = useState(false)
  const [doorbellDisabled, setDoorbellDisabled] = useState(false)

  useEffect(() => {
    const bootstrapUser = async () => {
      let uidInParams = new URL(document.location.href).searchParams.get("id")
      if(uid === "" && uidInParams) {
        setUid(uidInParams)
      }
      if(loggedIn || registering) return;
      let headers = new Headers();
      headers.append("Authorization", "Basic " + base64_encode(uid + ":" + password))
      const userCheck = await fetch(
        API_URL + "/user/" + uid,
        {
          method: "GET",
          headers: headers
        }
      )
      switch(userCheck.status) {
        case 204:
          // we need to register
          setRegistering(true)
        case 200:
          // boostrap user data
          await setUserInfo(await userCheck.json())
          await setLoggedIn(true)
        case 401:
          // invalid password
      }
    }
    bootstrapUser()
  })

  const register = async (username: string, password: string) => {
    let headers = new Headers();
    //headers.append("Authorization", "Basic " + base64_encode(uid + ":" + password))
    const userRegister = await fetch(
      API_URL + "/user/" + uid,
      {
        method: "POST",
        headers: headers,
        body: JSON.stringify({
          'username': username,
          'password': password
        })
      }
    )

    if(userRegister.status !== 200) {
      console.log("something went wrong")
      console.log(await userRegister.json())
      return
    }

    setRegistering(false)
   
  }

  const ring = async () => {
    setDoorbellLoading(true) 
    let headers = new Headers()
    headers.append("Authorization", "Basic " + base64_encode(uid + ":" + password))
    const userCheck = await fetch(
      API_URL + "/ring",
      {
        method: "POST",
        headers: headers
      }
    )
    setDoorbellLoading(false)
    setDoorbellDisabled(true)
    setTimeout(() => {
      setDoorbellDisabled(false)
    }, 30000)
  }

  if(!loggedIn && !registering) {
    return (
      <main className="flex min-h-screen flex-col justify-center mx-auto p-12 gap-6 max-w-prose">
        <Login onSubmit={(pass: string) => {setPassword(pass)}}/>
      </main>
    )
  }

  if(loggedIn) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <Ringer loading={doorbellLoading} disabled={doorbellDisabled} userInfo={userInfo} onSubmit={ring} partyInfo="" />
        <Spacer />
        <AdminPanel userInfo={userInfo} uid={uid} password={password} />
      </main>
    )
  }

  if(registering) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <Register onSubmit={register}/>
      </main>
    )
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
    </main>
  )
}
