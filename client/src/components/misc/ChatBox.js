import { Box } from "@chakra-ui/layout";
import React from "react";
import { useSelector } from "react-redux";
import SingleChat from "./SingleChat";

const ChatBox = () => {
  const user = useSelector((state) => state.user.currentUser);
  const { selectedChat, chats } = useSelector((state) => state.chat);
  return (
    <Box
      d={{ base: selectedChat ? "flex" : "none", md: "flex" }}
      alignItems="center"
      flexDir="column"
      p={3}
      bg="white"
      w={{ base: "100%", md: "68%" }}
      borderRadius="lg"
      borderWidth="1px"
    >
      <SingleChat /*fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}*/ />
    </Box>
  );
};

export default ChatBox;
