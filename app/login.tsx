"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

export interface LoginProps {
  onSubmit(password: string): void;
}

export default function Login(props: LoginProps) {
  const [password, setPassword] = useState<string>("");
  const inputRef = useRef<any>(null);

  const submitPassword = (e: any) => {
    e.preventDefault();
    props.onSubmit(password);
  };

  useEffect(() => {
    if (inputRef) {
      inputRef?.current?.focus();
    }
  });

  return (
    <>
      <h1 className="font-serif text-peach text-4xl uppercase">Suite Access</h1>
      <div className="text-periwinkle font-sans text-sm uppercase">
        <p>Site: LV-8-XXXI</p>
        <p>Access level Beta required</p>
        <p>Decontaminate before entry</p>
      </div>
      <form className="flex flex-col gap-4">
        <input
          type="password"
          ref={inputRef}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Your password"
          className="bg-transparent border-0 border-b-2 border-b-peach focus:border-b-citron !outline-none font-sans pb-1"
        />
        <input type="submit" value="" onClick={(e) => submitPassword(e)} />
      </form>
    </>
  );
}
