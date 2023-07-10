"use client";

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { library } from "@fortawesome/fontawesome-svg-core";
import { faBell, faSkull } from "@fortawesome/free-solid-svg-icons";
import { Text, Spacer, Card, Button, Loading, Table, Checkbox } from '@nextui-org/react'
import {decode as base64_decode, encode as base64_encode} from 'base-64'

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
          minWidth: "100%",
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
                <Checkbox isSelected={item.banned} onChange={(checked: boolean) => {
                  updateUser({
                    ...item,
                    banned: checked
                  })
                }}>
                </Checkbox>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      {usersTable}
    </div>
  )
}
