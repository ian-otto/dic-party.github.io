"use client";

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { library } from "@fortawesome/fontawesome-svg-core";
import { faBell, faSkull } from "@fortawesome/free-solid-svg-icons";
import { Text, Spacer, Card, Button, Loading, Table, Switch, Input } from '@nextui-org/react'
import { decode as base64_decode, encode as base64_encode } from 'base-64'
import { colors } from './constants'


library.add(faBell)
library.add(faSkull)

const API_URL = "https://7mg5vpebc4.execute-api.us-west-2.amazonaws.com"

export interface AdminPanelProps {
  userInfo: any
  uid: string
  password: string
}

export default function AdminPanel(props: AdminPanelProps) {
  if (!props.userInfo?.admin) {
    return
  }

  const [users, setUsers] = useState([])
  const [rings, setRings] = useState([])
  const [partyLoading, setPartyLoading] = useState(false)

  const getUsers = async () => {
    let headers = new Headers()
    headers.append("Authorization", "Basic " + base64_encode(props.uid + ":" + props.password))
    const apiUsers = await fetch(
      API_URL + "/user/",
      {
        method: "GET",
        headers: headers
      }
    )

    if(apiUsers.status === 200) {
      let temp = await apiUsers.json()
      setUsers(temp["users"])
    }
  }

  const getRings = async () => {
    let timestamp = Math.round((Date.now() / 1000) - 300) // last 5 minutes

    let headers = new Headers()
    headers.append("Authorization", "Basic " + base64_encode(props.uid + ":" + props.password))
    const apiRings = await fetch(
      API_URL + "/ring/" + timestamp,
      {
        method: "GET",
        headers: headers
      }
    )

    if(apiRings.status === 200) {
      let temp = await apiRings.json()
      setRings(temp["rings"])
    }
  }

  const updateUser = async (userInfo: any) => {
    let headers = new Headers()
    headers.append("Authorization", "Basic " + base64_encode(props.uid + ":" + props.password))
    const apiUsers = await fetch(
      API_URL + "/user/" + userInfo.id,
      {
        method: "POST",
        headers: headers,
        body: JSON.stringify(userInfo)
      }
    )
    getUsers()
  }

  useEffect(() => {
    getUsers()
    getRings()
  }, [])

  
  let usersTable = (
    <Loading />
  )

  if(users.length > 0) {
    usersTable = (
      <Table 
        striped
        sticked
        bordered
        aria-label="User admin table"
        css={{
          height: "auto",
          width: "100%",
        }}
      >
        <Table.Header>
          <Table.Column>UID</Table.Column>
          <Table.Column>Username</Table.Column>
          <Table.Column>Banned</Table.Column>
        </Table.Header>
        <Table.Body>
          {users.map((item) => (
            <Table.Row key={item.id}>
              <Table.Cell>{item.id}</Table.Cell>
              <Table.Cell>{item.username}</Table.Cell>
              <Table.Cell>
                <Switch checked={item.banned} onChange={(e: any) => {
                  updateUser({
                    ...item,
                    banned: e.checked
                  })
                }}>
                </Switch>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    )
  }

  let ringsTable = (
    <Loading />
  )

  if(rings.length > 0) {
    ringsTable = (
      <Table 
        sticked
        bordered
        aria-label="Ring log"
      >
        <Table.Header>
          <Table.Column>UID</Table.Column>
          <Table.Column>Timestamp</Table.Column>
          <Table.Column>Valid</Table.Column>
        </Table.Header>
        <Table.Body className="bg-white">
          {rings.map((item) => (
            <Table.Row key={item.timestamp + item.uid}>
              <Table.Cell>{item.uid}</Table.Cell>
              <Table.Cell>{new Date(parseInt(item.timestamp) * 1000).toLocaleString("en-US", {month: "short", day: "numeric", hour: "numeric", minute: "2-digit"})}</Table.Cell>
              <Table.Cell>
                {item.valid}
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    )
  }

  return (
    <div className="flex flex-col gap-1 text-center">
      <Spacer />
      <div>
        <form>
          <input placeholder="set party details (default '???')" className="rounded-md"/>
          <input type="submit" value="" onClick={e => updatePartyDetails(e)} />
        </form>
      </div>
      <Spacer />
      <Text h1 color={colors.dcpurple} className="text-3xl font-bold">Users</Text>
      {usersTable}
      <Text h2 color={colors.dcpurple} className="text-3xl font-bold">Rings</Text>
      {ringsTable}
    </div>
  )
}
