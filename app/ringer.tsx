"use client";

import Image from 'next/image'
import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { library } from "@fortawesome/fontawesome-svg-core";
import { faBell, faSkull } from "@fortawesome/free-solid-svg-icons";
import { Text, Spacer, Card, Button, Loading, Progress } from '@nextui-org/react'
import { colors } from './constants'

library.add(faBell)
library.add(faSkull)

export interface RingerProps {
  onSubmit: () => void
  loading: boolean
  disabled: boolean
  userInfo: any
  partyInfo: string
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
    <div className="flex flex-col">
      <div>
          <Text color={colors.dcblue}>username&gt; {props.userInfo.username}</Text>
          <Text 
            color={props.userInfo.banned ? colors.dcorange : colors.dcblue}
          >
            status&gt; {props.userInfo.banned ? "banned" : "active"}
          </Text>
          <Text
            color={colors.dcyellow}
          >
            party location&gt; {props.partyInfo}
          </Text>
      </div>
      <Spacer />
      <Button
        bordered
        size="xl"
        css={{
          color: colors.dcpurple,
          borderColor: colors.dcpurple
        }} 
        disabled={props.disabled || props.userInfo.banned ? true : false} 
        onPress={props.onSubmit}>
          {buttonContent}
      </Button>
    </div>
  );
}
