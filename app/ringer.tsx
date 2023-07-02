"use client";

import Image from 'next/image'
import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { library } from "@fortawesome/fontawesome-svg-core";
import { faBell, faSkull } from "@fortawesome/free-solid-svg-icons";

library.add(faBell)
library.add(faSkull)

export interface RingerProps {
  onSubmit: (string) => void
  loading: boolean
  banned: boolean
}

export default function Ringer(props: RingerProps) {
  if(props.banned) {
    return (
      <FontAwesomeIcon icon={faSkull} />
    );
  }
  return (
    <>
      <FontAwesomeIcon icon={faBell} shake size="2xl" />
    </>
  );
}
