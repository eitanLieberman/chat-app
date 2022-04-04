import React, { useEffect, useState } from "react";
import axios from "axios";
import { Box } from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import SideDrawer from "../../components/misc/SideDrawer";

import ChatBox from "../../components/misc/ChatBox";
import MyChats from "../../components/misc/MyChats";
import { getChats } from "../../redux/apiCalls";
const Chat = () => {
  const dispatch = useDispatch();
  // const loadChats = async () => {
  //   await getChats(dispatch);
  // };
  return (
    <>
      <div style={{ width: "100%" }}>
        <SideDrawer />
        <Box d="flex" justifyContent="space-between" w="100%" h="90vh" p="10px">
          <MyChats />
          <ChatBox />
        </Box>
      </div>
    </>
  );
};

export default Chat;
