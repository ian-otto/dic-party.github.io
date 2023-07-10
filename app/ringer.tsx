"use client";

import Image from 'next/image'
import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { library } from "@fortawesome/fontawesome-svg-core";
import { faBell, faSkull } from "@fortawesome/free-solid-svg-icons";
import { Text, Spacer, Card, Button, Loading } from '@nextui-org/react'

library.add(faBell)
library.add(faSkull)

export interface RingerProps {
  onSubmit: () => void
  loading: boolean
  disabled: boolean
  banned: boolean
  userInfo: any
}

export default function Ringer(props: RingerProps) {
  let buttonContent = null
  if(props.loading) {
    buttonContent = (
      <Loading color="currentColor" size="sm" />
    )
  } else {
    buttonContent = "Ding Dong"
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
          <Text color="primary">username> {props.userInfo.username}</Text>
          <Text 
            color={props.userInfo.banned ? "error" : "primary"}
          >
            status> {props.userInfo.banned ? "banned" : "active"}
          </Text>
      </div>
      <Button bordered size="xl" disabled={props.disabled ? true : false} onPress={props.onSubmit}>
        {buttonContent}
      </Button>
    </div>
  );
}
