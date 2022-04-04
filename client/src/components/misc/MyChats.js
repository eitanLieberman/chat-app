import { AddIcon } from "@chakra-ui/icons";
import { getSender, getSenderFull } from "../../config/ChatLogics";
import { Box, Stack, Text } from "@chakra-ui/layout";
import { useToast } from "@chakra-ui/toast";
import axios from "axios";
import { useEffect, useState } from "react";
import ChatLoading from "./ChatLoading";
// import GroupChatModal from "./miscellaneous/GroupChatModal";
import {
  Button,
  Menu,
  MenuButton,
  MenuDivider,
  MenuList,
  useDisclosure,
} from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { getChats, startChat } from "../../redux/apiCalls";
import GroupChatModal from "./GroupChatModal";
import { targetChat } from "../../redux/chatRedux";

const MyChats = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.currentUser);
  const { selectedChat, chats } = useSelector((state) => state.chat);
  console.log(user);
  const toast = useToast();
  const handleJoinMain = async () => {
    const config = {
      headers: { token: `Bearer ${user.accessToken}` },
    };
    const { data } = await axios.put(
      `/api/chats/invite`,
      {
        chatId: "6249c8afd68e36f20be8e5db",
        userId: user._id,
      },
      config
    );

    dispatch(targetChat(data));
    await fetchChats();
    toast({
      title: "you have joined main chat",

      status: "success",
      duration: 5000,
      isClosable: true,
      position: "bottom",
    });
  };
  const fetchChats = async () => {
    try {
      await getChats(dispatch, user.accessToken);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the chats",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  useEffect(() => {
    // setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));

    fetchChats();
    // eslint-disable-next-line
  }, [selectedChat]);

  return (
    <Box
      d={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDir="column"
      alignItems="center"
      p={3}
      bg="white"
      w={{ base: "100%", md: "31%" }}
      borderRadius="lg"
      borderWidth="1px"
    >
      <Box
        pb={3}
        px={3}
        fontSize={{ base: "28px", md: "30px" }}
        fontFamily="Work sans"
        d="flex"
        w="100%"
        justifyContent="space-between"
        alignItems="center"
      >
        My Chats
        <Menu>
          <MenuButton as={Button}>...</MenuButton>
          <MenuList>
            <GroupChatModal>
              <Button
                d="flex"
                fontSize={{ base: "17px", md: "10px", lg: "17px" }}
                rightIcon={<AddIcon />}
              >
                New Group Chat
              </Button>
            </GroupChatModal>
            <MenuDivider />
            <Button onClick={handleJoinMain}>join main chat</Button>
          </MenuList>
        </Menu>
      </Box>
      <Box
        d="flex"
        flexDir="column"
        p={3}
        bg="#F8F8F8"
        w="100%"
        h="100%"
        borderRadius="lg"
        overflowY="hidden"
      >
        {chats ? (
          <Stack overflowY="scroll">
            {chats.map((chat) => (
              <Box
                onClick={
                  !chat.isGroupChat
                    ? async () => {
                        await startChat(
                          dispatch,
                          await getSenderFull(user, chat.users),
                          user.accessToken
                        );
                      }
                    : async () => {
                        await dispatch(targetChat(chat));
                      }
                }
                cursor="pointer"
                bg={selectedChat?._id === chat._id ? "#38B2AC" : "#E8E8E8"}
                color={selectedChat?._id === chat._id ? "white" : "black"}
                px={3}
                py={2}
                borderRadius="lg"
                key={chat._id}
              >
                <Text>
                  {!chat.isGroupChat
                    ? getSender(user, chat.users)
                    : chat.chatName}
                </Text>
                {chat.latestMessage && (
                  <Text fontSize="xs">
                    <b>{chat.latestMessage.sender.username} : </b>
                    {chat.latestMessage.content.length > 50
                      ? chat.latestMessage.content.substring(0, 51) + "..."
                      : chat.latestMessage.content}
                  </Text>
                )}
              </Box>
            ))}
          </Stack>
        ) : (
          <ChatLoading />
        )}
      </Box>
    </Box>
  );
};

export default MyChats;
