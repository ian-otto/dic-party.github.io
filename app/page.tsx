"use client";

import { NextUIProvider, createTheme } from "@nextui-org/react";
import { decode as base64_decode, encode as base64_encode } from "base-64";
import Image from "next/image";
import React, { useEffect, useState } from "react";

import AdminPanel from "./adminPanel";
import Login from "./login";
import Register from "./register";
import Ringer from "./ringer";

const API_URL = "https://7mg5vpebc4.execute-api.us-west-2.amazonaws.com";

const theme = createTheme({
  type: "dark", // it could be "light" or "dark"
  theme: {
    colors: {
      primary: "#686EA0",
    },
    space: {},
    fonts: {
      sans: "highway-gothic, sans-serif",
    },
  },
});

export default function Home() {
  const [password, setPassword] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [registering, setRegistering] = useState(false);
  const [uid, setUid] = useState("");
  const [userInfo, setUserInfo] = useState(null);
  const [doorbellLoading, setDoorbellLoading] = useState(false);
  const [doorbellDisabled, setDoorbellDisabled] = useState(false);
  const [partyInfo, setPartyInfo] = useState("");

  useEffect(() => {
    const bootstrapUser = async () => {
      let uidInParams = new URL(document.location.href).searchParams.get("id");
      if (uid === "" && uidInParams) {
        setUid(uidInParams);
      }
      if (loggedIn || registering) return;
      let headers = new Headers();
      headers.append(
        "Authorization",
        "Basic " + base64_encode(uid + ":" + password)
      );
      const userCheck = await fetch(API_URL + "/user/" + uid, {
        method: "GET",
        headers: headers,
      });
      switch (userCheck.status) {
        case 204:
          // we need to register
          setRegistering(true);
          break;
        case 200:
          // boostrap user data
          await setUserInfo(await userCheck.json());
          await setLoggedIn(true);
          setInterval(partyDetailsWatchdog, 2000);
          break;
        case 401:
        // invalid password
      }
    };
    bootstrapUser();
  });

  const partyDetailsWatchdog = async () => {
    let headers = new Headers();
    headers.append(
      "Authorization",
      "Basic " + base64_encode(uid + ":" + password)
    );
    const details = await fetch(API_URL + "/announce/party", {
      method: "GET",
      headers: headers,
    });

    if (details.status !== 200) {
      console.log("Something went wrong fetching party details");
      return;
    }

    let newInfo = await details.json();
    await setPartyInfo(newInfo.text);
  };

  const register = async (username: string, password: string) => {
    let headers = new Headers();
    const userRegister = await fetch(API_URL + "/user/" + uid, {
      method: "POST",
      headers: headers,
      body: JSON.stringify({
        username: username,
        password: password,
      }),
    });

    if (userRegister.status !== 200) {
      console.log("something went wrong");
      console.log(await userRegister.json());
      return;
    }

    setRegistering(false);
  };

  const ring = async () => {
    setDoorbellLoading(true);
    let headers = new Headers();
    headers.append(
      "Authorization",
      "Basic " + base64_encode(uid + ":" + password)
    );
    const userCheck = await fetch(API_URL + "/ring", {
      method: "POST",
      headers: headers,
    });
    setDoorbellLoading(false);
    setDoorbellDisabled(true);
    setTimeout(() => {
      setDoorbellDisabled(false);
    }, 30000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-dark text-white">
      <header className="flex">
        <aside className="hidden sm:flex bg-periwinkle h-[136.5px] flex-grow">
          &nbsp;
        </aside>
        <div className="max-w-prose">
          <Image
            src="/images/dic-header-periwinkle.svg"
            width="700"
            height="200"
            className="w-full"
            alt="DiC Logo"
          />
        </div>
        <aside className="hidden sm:flex bg-periwinkle h-[76px] flex-grow">
          &nbsp;
        </aside>
      </header>

      <main className="flex flex-col flex-grow justify-center mx-auto p-12 gap-6 max-w-prose">
        {!loggedIn && !registering && (
          <Login
            onSubmit={(pass: string) => {
              setPassword(pass);
            }}
          />
        )}

        {loggedIn && (
          <div className="flex flex-col gap-20">
            <Ringer
              loading={doorbellLoading}
              disabled={doorbellDisabled}
              userInfo={userInfo}
              onSubmit={ring}
              partyInfo={partyInfo}
            />
            <AdminPanel userInfo={userInfo} uid={uid} password={password} />
          </div>
        )}

        {registering && <Register onSubmit={register} />}
      </main>

      <footer className="bg-periwinkle text-right text-white/60 text-xs font-sans uppercase py-2 px-7 mt-auto">
        <div className="max-w-prose mx-auto">
          <p>DEFCON is cancelled</p>
          <p>All&apos;s right with the world</p>
        </div>
      </footer>
    </div>
  );
}
