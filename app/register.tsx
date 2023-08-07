"use client";

import { library } from "@fortawesome/fontawesome-svg-core";
import { faBell, faSkull } from "@fortawesome/free-solid-svg-icons";
import { Input } from "@nextui-org/react";
import { useState } from "react";

library.add(faBell);
library.add(faSkull);

export interface RegisterProps {
  onSubmit(username: string, password: string): void;
}

export default function Register(props: RegisterProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [invalidPass, setInvalidPass] = useState(false);

  const submit = (e: any) => {
    e.preventDefault();

    if (username && password && !invalidPass) {
      props.onSubmit(username, password);
    }
  };

  const onPasswordChange = (e: any) => {
    let pass = e.target.value;
    setPassword(pass);
    if (pass.indexOf(":") !== -1) {
      setInvalidPass(true);
      return;
    }

    setInvalidPass(false);
  };

  return (
    <>
      <h1 className="font-serif text-peach text-4xl">Register</h1>
      <div className="text-periwinkle font-sans text-sm uppercase">
        <p>Access level confirmed</p>
        <p>Decontamination successful</p>
      </div>
      <p className="font-serif">
        Welcome, esteemed Board member. You are known to us. Please select a
        username and password to access suite controls.
      </p>
      <form className="flex flex-col gap-4">
        {invalidPass ? <b>Invalid character in password (:)</b> : ""}
        <input
          placeholder="Username"
          onChange={(e) => {
            setUsername(e.target.value);
          }}
          className="bg-transparent border-0 border-b-2 border-b-peach focus:border-b-citron !outline-none font-sans pb-1"
        />
        <input
          type="password"
          placeholder="Password"
          onChange={onPasswordChange}
          className="bg-transparent border-0 border-b-2 border-b-peach focus:border-b-citron !outline-none font-sans pb-1"
        />
        <input type="submit" value="" onClick={(e) => submit(e)} />
      </form>
    </>
  );
}
