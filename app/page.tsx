"use client";


import Image from 'next/image'
import Login from './login'
import React, { useState, useEffect } from 'react'
import { useSearchParams } from "react-router-dom"


const API_URL = "https://7mg5vpebc4.execute-api.us-west-2.amazonaws.com"


export default function Home() {
  const [password, setPassword] = useState()
  const [loggedIn, setLoggedIn] = useState(false)
  const [registering, setRegistering] = useState(false)
  const query = new URLSearchParams(window.location.search)
  const username = query.get("id")

  useEffect(() => {
    const bootstrapUser = async () => {
      if(loggedIn || registering) return;
      const userCheck = await fetch(API_URL + "/user/" + username);
      switch(userCheck.satus) {
        case 204:
          // we need to register
        case 200:
          // boostrap user data
        case 401:
          // invalid password
      }
    }
    bootstrapUser()
  })

  const checkIfRegistrationRequired = async () => {
    
  }

  const onPasswordSubmit = (p: string) => {
     
  }

  if(!password) {
    return (
      <main className="flex min-h-screen flex-col justify-center mx-auto p-12 gap-6 max-w-prose">
        <Login onSubmit={(pass: string) => {setPassword(pass)}}/>
      </main>
    )
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
    </main>
  )

}
