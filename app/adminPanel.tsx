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
  uid: string | null
  password: string | null
}

export default function AdminPanel(props: AdminPanelProps) {
  const [users, setUsers] = useState([])
  const [rings, setRings] = useState([])
  const [partyLoading, setPartyLoading] = useState(false)
  const [partyDetails, setPartyDetails] = useState('')

  
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
    let timestamp = Math.round((Date.now() / 1000) - 600) // last 10 minutes

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

  const updatePartyDetails = async (e: any) => {
    e.preventDefault()
    let headers = new Headers()
    headers.append("Authorization", "Basic " + base64_encode(props.uid + ":" + props.password))
    const apiUsers = await fetch(
      API_URL + "/announce/party",
      {
        method: "POST",
        headers: headers,
        body: JSON.stringify({
          text: partyDetails
        })
      }
    )
  }

  useEffect(() => {
    if(props.userInfo.admin) {
      getUsers()
      getRings()
      setInterval(getRings, 5000)
    }
  }, [props.userInfo])

  if (!props.userInfo?.admin) {
    return
  }
  
  let usersTable = (
    <Loading />
  )

  const tableHeaderCSS = {
    backgroundColor: 'transparent',
    color: 'white',
  }

  if(users.length > 0) {
    usersTable = (
      <Table 
        aria-label="User admin table"
        css={{
          height: "auto",
          width: "100%",
        }}
      >
        <Table.Header>
          <Table.Column css={tableHeaderCSS}>UID</Table.Column>
          <Table.Column css={tableHeaderCSS}>Username</Table.Column>
          <Table.Column css={tableHeaderCSS}>Banned</Table.Column>
          <Table.Column css={tableHeaderCSS}>Admin</Table.Column>
        </Table.Header>
        <Table.Body>
          {users.map((item: any) => (
            <Table.Row key={item.id}
              css={{
                color: colors.dcblue,
                textAlign: 'left'
              }}
            >
              <Table.Cell>{item.id}</Table.Cell>
              <Table.Cell>{item.username}</Table.Cell>
              <Table.Cell>
                <Switch checked={item.banned} onChange={(e: any) => {
                  updateUser({
                    ...item,
                    banned: e.target.checked
                  })
                }}>
                </Switch>
              </Table.Cell>
              <Table.Cell>
                <Switch checked={item.admin} onChange={(e: any) => {
                  updateUser({
                    ...item,
                    admin: e.target.checked
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
        aria-label="Ring log"
      >
        <Table.Header>
          <Table.Column css={tableHeaderCSS}>UID</Table.Column>
          <Table.Column css={tableHeaderCSS}>Timestamp</Table.Column>
        </Table.Header>
        <Table.Body>
          {rings.map((item: any) => (
            <Table.Row
              key={item.timestamp + item.uid}
              css={{
                color: colors.dcblue,
                textAlign: 'left'
              }}>
              <Table.Cell>{item.uid}</Table.Cell>
              <Table.Cell>{new Date(parseInt(item.timestamp) * 1000).toLocaleString("en-US", {month: "short", day: "numeric", hour: "numeric", minute: "2-digit"})}</Table.Cell>
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
          <input placeholder="set party details (default 'TBA')" className="rounded-md bg-transparent border-0 border-b-2 border-b-periwinkle focus:border-b-mint !outline-none pb-1" onChange={e => setPartyDetails(e.target.value)}/>
          <input type="submit" value="" onClick={e => updatePartyDetails(e)}/>
        </form>
      </div>
      <Spacer />
      <Text h1 color={colors.dcpurple} className="text-3xl font-bold">Users</Text>
      {usersTable}
      <Spacer />
      <Text h2 color={colors.dcpurple} className="text-3xl font-bold">Rings</Text>
      {ringsTable}
    </div>
  )
}
