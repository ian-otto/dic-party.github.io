"use client";

import { library } from "@fortawesome/fontawesome-svg-core";
import { faBell, faSkull } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Button,
  Card,
  Checkbox,
  Input,
  Loading,
  Spacer,
  Switch,
  Table,
} from "@nextui-org/react";
import { decode as base64_decode, encode as base64_encode } from "base-64";
import Image from "next/image";
import { useEffect, useState } from "react";
import css from "styled-jsx/css";

import { colors } from "./constants";

library.add(faBell);
library.add(faSkull);

const API_URL = "https://7mg5vpebc4.execute-api.us-west-2.amazonaws.com";

export interface AdminPanelProps {
  userInfo: any;
  uid: string | null;
  password: string | null;
  partyTime: boolean;
}

export default function AdminPanel(props: AdminPanelProps) {
  const [users, setUsers] = useState([]);
  const [rings, setRings] = useState([]);
  const [partyLoading, setPartyLoading] = useState(false);
  const [partyDetails, setPartyDetails] = useState("");
  const [bellLoading, setBellLoading] = useState(false);

  const getUsers = async () => {
    let headers = new Headers();
    headers.append(
      "Authorization",
      "Basic " + base64_encode(props.uid + ":" + props.password)
    );
    const apiUsers = await fetch(API_URL + "/user/", {
      method: "GET",
      headers: headers,
    });

    if (apiUsers.status === 200) {
      let temp = await apiUsers.json();
      setUsers(temp["users"]);
    }
  };

  const getRings = async () => {
    let timestamp = Math.round(Date.now() / 1000 - 600); // last 10 minutes

    let headers = new Headers();
    headers.append(
      "Authorization",
      "Basic " + base64_encode(props.uid + ":" + props.password)
    );
    const apiRings = await fetch(API_URL + "/ring/" + timestamp, {
      method: "GET",
      headers: headers,
    });

    if (apiRings.status === 200) {
      let temp = await apiRings.json();
      setRings(temp["rings"]);
    }
  };

  const updateUser = async (userInfo: any) => {
    let headers = new Headers();
    headers.append(
      "Authorization",
      "Basic " + base64_encode(props.uid + ":" + props.password)
    );
    const apiUsers = await fetch(API_URL + "/user/" + userInfo.id, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(userInfo),
    });
    getUsers();
  };

  const updatePartyDetails = async (e: any) => {
    e.preventDefault();
    let headers = new Headers();
    headers.append(
      "Authorization",
      "Basic " + base64_encode(props.uid + ":" + props.password)
    );
    const apiUsers = await fetch(API_URL + "/announce/party", {
      method: "POST",
      headers: headers,
      body: JSON.stringify({
        text: partyDetails,
      }),
    });
  };

  const updateBellEnabled = async () => {
    setBellLoading(true);
    let headers = new Headers();
    headers.append(
      "Authorization",
      "Basic " + base64_encode(props.uid + ":" + props.password)
    );
    let enabled = 'Y';
    if(props.partyTime) enabled = 'N';
    const bell = await fetch(API_URL + "/announce/bell", {
      method: "POST",
      headers: headers,
      body: JSON.stringify({
        text: enabled,
      }),
    });
    setBellLoading(false);
  }

  useEffect(() => {
    if (props.userInfo.admin) {
      getUsers();
      getRings();
      setInterval(getRings, 5000);
    }
  }, [props.userInfo]);

  if (!props.userInfo?.admin) {
    return;
  }

  let usersTable = <Loading />;

  const tableHeaderCSS = {
    backgroundColor: "transparent",
    color: "white",
  };

  const tableCellCSS = {
    backgroundColor: "transparent",
    color: "white",
  };

  if (users.length > 0) {
    usersTable = (
      <Table
        compact
        bordered={false}
        borderWeight={0}
        aria-label="User admin table"
        css={{
          height: "auto",
          minWidth: "100%",
          padding: "0px",
        }}
      >
        <Table.Header>
          <Table.Column
            css={{
              backgroundColor: "transparent",
              paddingLeft: "0px !important",
            }}
          >
            User
          </Table.Column>
          <Table.Column
            css={{
              backgroundColor: "transparent",
              textAlign: "center",
            }}
          >
            Banned
          </Table.Column>
          <Table.Column
            css={{
              backgroundColor: "transparent",
              textAlign: "center",
            }}
          >
            Admin
          </Table.Column>
        </Table.Header>
        <Table.Body>
          {users.map((item: any) => (
            <Table.Row key={item.id}>
              <Table.Cell
                css={{
                  paddingLeft: "0px !important",
                }}
              >
                <p className="font-serif text-lg text-citron leading-1">
                  {item.username}
                </p>
                <p className="font-sans text-xs leading-1 text-white">
                  {item.id}
                </p>
              </Table.Cell>
              <Table.Cell
                css={{
                  textAlign: "center",
                }}
              >
                <Checkbox
                  isSelected={item.banned}
                  onChange={(e: boolean) => {
                    updateUser({
                      ...item,
                      banned: e,
                    });
                  }}
                ></Checkbox>
              </Table.Cell>
              <Table.Cell
                css={{
                  textAlign: "center",
                }}
              >
                <Checkbox
                  isSelected={item.admin}
                  onChange={(e: boolean) => {
                    updateUser({
                      ...item,
                      admin: e,
                    });
                  }}
                ></Checkbox>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    );
  }

  let ringsTable = <Loading />;

  if (rings.length > 0) {
    ringsTable = (
      <Table
        compact
        striped
        bordered={false}
        borderWeight={0}
        aria-label="Ring log"
        css={{
          height: "auto",
          minWidth: "100%",
          padding: "0px",
        }}
      >
        <Table.Header>
          <Table.Column
            css={{
              backgroundColor: "transparent",
              paddingLeft: "0px !important",
            }}
          >
            User
          </Table.Column>
          <Table.Column
            css={{
              backgroundColor: "transparent",
              textAlign: "right",
            }}
          >
            Timestamp
          </Table.Column>
        </Table.Header>
        <Table.Body>
          {rings.map((item: any) => (
            <Table.Row key={item.timestamp + item.uid}>
              <Table.Cell
                css={{
                  paddingLeft: "0px !important",
                }}
              >
                <p className="text-white">{item.uid}</p>
              </Table.Cell>
              <Table.Cell
                css={{
                  textAlign: "right",
                }}
              >
                <p className="text-white">
                  {new Date(parseInt(item.timestamp) * 1000).toLocaleString(
                    "en-US",
                    {
                      month: "short",
                      day: "numeric",
                      hour: "numeric",
                      minute: "2-digit",
                    }
                  )}
                </p>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    );
  }

  let buttonContent = null;
  if (bellLoading) {
    buttonContent = <Loading color="currentColor" size="sm" />;
  } else {
    buttonContent = props.partyTime ? "Disable Doorbell" : "Enable Doorbell";
  }


  return (
    <div className="flex flex-col gap-8">
      <h1 className="font-serif text-peach text-4xl uppercase">
        Admin Controls
      </h1>
      <section className="flex flex-col gap-2">
        <Button
          size="lg"
          className="!bg-periwinkle rounded-full font-sans uppercase"
          onPress={updateBellEnabled}
        >
          {buttonContent}
        </Button>
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="text-3xl font-serif text-periwinkle">
          Set Party Details
        </h2>
        <p className="font-serif">
          Edit the field below and press enter to display party information to
          lower-access Board members.
        </p>
        <form>
          <input
            placeholder="Set party details (default 'TBA')"
            className="bg-transparent border-0 border-b-2 border-b-peach focus:border-b-citron !outline-none font-sans pb-1 w-full"
            onChange={(e) => setPartyDetails(e.target.value)}
          />
          <input
            type="submit"
            value=""
            onClick={(e) => updatePartyDetails(e)}
          />
        </form>
      </section>

      <section className="flex flex-col gap-2 mt-10">
        <h2 className="text-3xl font-serif text-periwinkle">Users</h2>
        {usersTable}
      </section>

      <section className="flex flex-col gap-2 mt-10">
        <h2 className="text-3xl font-serif text-periwinkle">Ring Log</h2>
        {ringsTable}
      </section>
    </div>
  );
}
