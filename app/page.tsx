"use client";


import Image from 'next/image'
import Login from './login'
import Ringer from './ringer'
import React, { useState, useEffect } from 'react'
import {decode as base64_decode, encode as base64_encode} from 'base-64'

const API_URL = "https://7mg5vpebc4.execute-api.us-west-2.amazonaws.com"


export default function Home() {
  const [password, setPassword] = useState(null)
  const [loggedIn, setLoggedIn] = useState(false)
  const [registering, setRegistering] = useState(false)
  const username = new URL(document.location).searchParams.get("id");
  const [userInfo, setUserInfo] = useState(null)

  useEffect(() => {
    const bootstrapUser = async () => {
      console.log("Calling user bootstrapper")
      if(loggedIn || registering) return;
      let headers = new Headers();
      if(password) {
        headers.append("Authorization", "Basic " + base64_encode(username + ":" + password))
      }
      const userCheck = await fetch(
        API_URL + "/user/" + username,
        {
          method: "GET",
          headers: headers
        }
      );
      console.log(userCheck.status)
      switch(userCheck.status) {
        case 204:
          console.log(1)
          // we need to register
          setRegistering(true)
        case 200:
          console.log(2)
          // boostrap user data
          await setUserInfo(await userCheck.json())
          await setLoggedIn(true)
        case 401:
          // invalid password
      }
    }
    bootstrapUser()
  })

  if(!loggedIn && !registering) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <Login onSubmit={(pass: string) => {setPassword(pass)}}/>
      </main>
    )
  }

  if(loggedIn) {
    console.log("logged in")
    return (
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <b>Welcome {userInfo.username}</b>
        <Ringer banned={userInfo.banned} loading={false} />
      </main>
    )
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
    </main>
  )
}
