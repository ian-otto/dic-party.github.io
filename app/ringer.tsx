"use client";

import { library } from "@fortawesome/fontawesome-svg-core";
import { faBell, faSkull } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Loading } from "@nextui-org/react";
import Image from "next/image";
import { useState } from "react";

import { colors } from "./constants";

library.add(faBell);
library.add(faSkull);

export interface RingerProps {
  onSubmit: () => void;
  onResetSubmit: (username: string, password: string) => void;
  loading: boolean;
  disabled: boolean;
  userInfo: any;
  partyInfo: string;
}

export default function Ringer(props: RingerProps) {
  let [password, setPassword] = useState("");
  const [invalidPass, setInvalidPass] = useState(false);

  const submit = (e: any) => {
    e.preventDefault();

    if (password && !invalidPass) {
      props.onResetSubmit(props.userInfo.username, password);
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

  let buttonContent = null;
  if (props.loading) {
    buttonContent = <Loading color="currentColor" size="sm" />;
  } else {
    buttonContent = "Demand Access";
  }



  return (
    <>
      <div className="text-periwinkle font-sans text-sm uppercase">
        <h1 className="font-serif text-peach text-4xl uppercase">
          Information
        </h1>
        <p>Username: {props.userInfo.username}</p>
        <p>Status: {props.userInfo.banned ? "banned" : "active"}</p>
        {!props.userInfo.banned && (
          <p className="text-citron">
            Party: <br />
            {props.partyInfo}
          </p>
        )}
      </div>
      <div className="flex flex-col gap-2">
        <h1 className="font-serif text-peach text-4xl uppercase">Reset Password</h1>
        {invalidPass ? <b>Invalid character in password (:)</b> : ""}
        <p className="font-serif">
          Change your password here. 100% safe and intentional feature.
        </p>
        <input
            type="password"
            placeholder="Password"
            onChange={onPasswordChange}
            className="bg-transparent border-0 border-b-2 border-b-peach focus:border-b-citron !outline-none font-sans pb-1"
          />
        <input type="submit" value="" onClick={(e) => submit(e)} />
      </div>
      <div className="flex flex-col gap-2">
        <h1 className="font-serif text-peach text-4xl uppercase">Doorbell</h1>
        <p className="font-serif">
          Press the button below when you have arrived. You and one guest will
          be admitted.
        </p>
        <Button
          size="lg"
          className="!bg-periwinkle rounded-full font-sans uppercase"
          disabled={props.disabled || props.userInfo.banned ? true : false}
          onPress={props.onSubmit}
        >
          {buttonContent}
        </Button>
      </div>
    </>
  );
}
