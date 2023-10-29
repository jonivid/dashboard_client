import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";
import { FormControlLabel, Grid, Switch } from "@mui/material";
import { Responsive as ResponsiveGridLayout } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import axios from "axios";
import { apiPaths } from "../../../utils/apiPaths";
import io from "socket.io-client";

// type Anchor = "top" | "left" | "bottom" | "right";

export const DashboardHome = ({ setMode, mode }) => {
  const [state, setState] = useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });
  const [isTriggerOn, setIsTriggerOn] = useState(false);
  const toggleDrawer = (anchor, open) => (event) => {
    if (
      event &&
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

  const list = (anchor) => (
    <Box
      sx={{ width: anchor === "top" || anchor === "bottom" ? "auto" : 250 }}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <List>
        {["Inbox", "Starred", "Send email", "Drafts"].map((text, index) => (
          <ListItem key={text} disablePadding>
            <ListItemButton>
              <ListItemIcon>
                {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        {["All mail", "Trash", "Spam"].map((text, index) => (
          <ListItem key={text} disablePadding>
            <ListItemButton>
              <ListItemIcon>
                {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );
  const handleSwitch = (e) => {
    setMode();
    if (e.target.checked) {
      setMode("dark");
    } else setMode("light");
  };
  const handleApi = async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_REST_API}${
          isTriggerOn
            ? apiPaths.BINANCE_TRIGGER_STOP
            : apiPaths.BINANCE_TRIGGER_START
        }`,
      );
      setIsTriggerOn((pre) => !pre);
    } catch (error) {
      console.log(error);
    }
  };
  const layouts = {
    lg: [
      { i: "1", x: 0, y: 0, w: 4, h: 2 },
      { i: "2", x: 4, y: 0, w: 4, h: 2 },
      { i: "3", x: 8, y: 0, w: 4, h: 2 },
    ],
    md: [
      { i: "1", x: 0, y: 0, w: 6, h: 2 },
      { i: "2", x: 6, y: 0, w: 6, h: 2 },
      { i: "3", x: 0, y: 2, w: 12, h: 2 },
    ],
    sm: [
      { i: "1", x: 0, y: 0, w: 6, h: 2 },
      { i: "2", x: 0, y: 2, w: 6, h: 2 },
      { i: "3", x: 0, y: 4, w: 6, h: 2 },
    ],
    xs: [
      { i: "1", x: 0, y: 0, w: 4, h: 2 },
      { i: "2", x: 0, y: 2, w: 4, h: 2 },
      { i: "3", x: 0, y: 4, w: 4, h: 2 },
    ],
    xxs: [
      { i: "1", x: 0, y: 0, w: 2, h: 2 },
      { i: "2", x: 0, y: 2, w: 2, h: 2 },
      { i: "3", x: 0, y: 4, w: 2, h: 2 },
    ],
  };

  useEffect(() => {
    const socket = io(process.env.REACT_APP_WS_URL);
    socket.on("connect", () => {
      console.log("Connected to the server");

      // You can send and receive messages with the server here
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from the server");
    });

    // Clean up the socket connection when the component unmounts
    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <Grid
      style={{
        backgroundColor: mode === "light" ? "#f0f0f0" : "#121212",
        height: "100vh",
        width: "100vw",
      }}
    >
      {["left"].map((anchor) => (
        <React.Fragment key={anchor}>
          <Button onClick={toggleDrawer(anchor, true)}>{anchor}</Button>
          <SwipeableDrawer
            anchor={anchor}
            open={state[anchor]}
            onClose={toggleDrawer(anchor, false)}
            onOpen={toggleDrawer(anchor, true)}
          >
            {list(anchor)}
          </SwipeableDrawer>
        </React.Fragment>
      ))}
      <FormControlLabel
        control={<Switch defaultValue={false} onClick={handleSwitch} />}
      />
      <button onClick={handleApi}>{`${isTriggerOn ? "stop" : "start"}`}</button>
      <ResponsiveGridLayout
        className="layout"
        layouts={layouts}
        breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
        cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
        width={1200}
      >
        <div key="1" style={{ border: "1px solid red" }}>
          1
        </div>
        <div key="2" style={{ border: "1px solid red" }}>
          2
        </div>
        <div key="3" style={{ border: "1px solid red" }}>
          3
        </div>
      </ResponsiveGridLayout>
    </Grid>
  );
};
