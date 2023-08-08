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
  loading: boolean;
  disabled: boolean;
  userInfo: any;
  partyInfo: string;
}

export default function Ringer(props: RingerProps) {
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
