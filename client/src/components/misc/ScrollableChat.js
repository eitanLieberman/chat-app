import { Avatar } from "@chakra-ui/avatar";
import { Tooltip } from "@chakra-ui/tooltip";
import { Box, Text } from "@chakra-ui/react";

import {
  getSender,
  getSenderGroup,
  isLastMessage,
  isSameSender,
  isSameSenderMargin,
  isSameUser,
} from "../../config/ChatLogics";
import ScrollableFeed from "react-scrollable-feed";
import { useSelector } from "react-redux";

import React from "react";

const ScrollableChat = ({ messages, users }) => {
  console.log(users);
  const user = useSelector((state) => state.user.currentUser);
  return (
    <Box overflowY="scroll" style={{ overflow: "scroll" }}>
      {messages &&
        messages.map((m, i) => (
          <div style={{ display: "flex" }} key={m._id}>
            {(isSameSender(messages, m, i, user._id) ||
              isLastMessage(messages, i, user._id)) && (
              <Tooltip label={m.sender.name} placement="bottom-start" hasArrow>
                <Avatar
                  mt="7px"
                  mr={1}
                  size="sm"
                  cursor="pointer"
                  name={m.sender.username}
                  src={m.sender.pic}
                />
              </Tooltip>
            )}
            <span
              style={{
                backgroundColor: `${
                  m.sender._id === user._id ? "#BEE3F8" : "#B9F5D0"
                }`,
                marginLeft: isSameSenderMargin(messages, m, i, user._id),
                marginTop: isSameUser(messages, m, i, user._id) ? 3 : 10,
                borderRadius: "20px",
                padding: "5px 15px",
                maxWidth: "75%",
              }}
            >
              {" "}
              <Text fontWeight={"bold"}>{getSenderGroup(m.sender, users)}</Text>
              {m.content}
              <Text size={"xs"} color="gray">
                {new Date(m.createdAt).getHours() +
                  ":" +
                  new Date(m.createdAt).getMinutes()}
              </Text>
            </span>
          </div>
        ))}
    </Box>
  );
};

export default ScrollableChat;
