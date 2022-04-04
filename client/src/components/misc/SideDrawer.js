import { Button } from "@chakra-ui/button";
import { Box, Text } from "@chakra-ui/layout";
import { use, useToast } from "@chakra-ui/toast";
import { Search2Icon, BellIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { Tooltip } from "@chakra-ui/tooltip";
import { Input } from "@chakra-ui/input";
import React, { useState } from "react";
import { Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/menu";
import { Avatar } from "@chakra-ui/avatar";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser, startChat } from "../../redux/apiCalls";
import ProfileModal from "./ProfileModal";
import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  MenuDivider,
} from "@chakra-ui/react";
import { useDisclosure } from "@chakra-ui/hooks";
import axios from "axios";
import ChatLoading from "./ChatLoading";
import UserListItem from "./UserListItem";
import { getSender, getSenderFull } from "../../config/ChatLogics";
import { newNotification, targetChat } from "../../redux/chatRedux";

const SideDrawer = () => {
  const toast = useToast();
  const user = useSelector((state) => state.user.currentUser);

  const { selectedChat, chats, notifications } = useSelector(
    (state) => state.chat
  );
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState("");
  const [loadingChat, setLoadingChat] = useState();

  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleClick = async (e) => {
    await logoutUser(dispatch);
  };
  const accessChat = async (userId) => {
    try {
      setLoadingChat(true);
      const data = await startChat(dispatch, userId, user.accessToken);

      setLoadingChat(false);
      onClose();
    } catch (err) {}
  };

  const handleSearch = async (e) => {
    if (!search) {
      toast({
        title: "please search for something",

        status: "warning",
        duration: 9000,
        isClosable: true,
        position: "top-left",
      });
      return;
    }
    try {
      setLoading(true);
      const config = {
        headers: { token: `Bearer ${user.accessToken}` },
      };
      const { data } = await axios.get(`/api/users/find/${search}`, config);
      setLoading(false);
      setSearchResult(data.filter((d) => d._id !== user._id));
    } catch (err) {}
  };

  return (
    <>
      <Box
        d="flex"
        justifyContent="space-between"
        alignItems="center"
        style={{ background: "white", padding: "5px 10px 5px 10px" }}
        w="100%"
        borderWidth="5px"
        // p="5px 10px 5px 10px"
      >
        <Tooltip label="search users to chat" hasArrow placement="bottom-end">
          <Button variant="ghost" onClick={onOpen}>
            <Search2Icon />
          </Button>
        </Tooltip>
        <Text fontSize="2xl" fontFamily="work sans">
          TALKS
        </Text>
        <div>
          <Menu>
            <MenuButton as={Button}>
              {!notifications.length ? "" : notifications.length}
              <BellIcon
                fontSize="2xl"
                color={!notifications.length ? "black" : "red"}
              />
            </MenuButton>
            <MenuList>
              {!notifications.length && "no new messages"}
              {notifications.map((notif) => (
                <MenuItem
                  key={notif._id}
                  onClick={
                    !notif.chat.isGroupChat
                      ? async () => {
                          await startChat(
                            dispatch,
                            await getSenderFull(user, notif.chat.users),
                            user.accessToken
                          );
                          dispatch(
                            newNotification(
                              notifications.filter((n) => n._id != notif._id)
                            )
                          );
                        }
                      : async () => {
                          await dispatch(targetChat(notif.chat));
                          dispatch(
                            newNotification(
                              notifications.filter((n) => n._id != notif._id)
                            )
                          );
                        }
                  }
                >
                  {notif.chat.isGroupChat
                    ? `new message in ${notif.chat.chatName}`
                    : `new message from ${getSender(user, notif.chat.users)}`}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
          <Menu>
            <MenuButton as={Button}>
              <ChevronDownIcon />
              <Avatar
                size="sm"
                cursor="pointer"
                name={user.username}
                src={user.pic}
              />
            </MenuButton>
            <MenuList>
              <ProfileModal user={user}>
                <MenuItem>My Profile</MenuItem>
              </ProfileModal>
              <MenuDivider />
              <MenuItem onClick={handleClick}>Logout</MenuItem>
            </MenuList>
          </Menu>
        </div>
      </Box>
      <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth="1px">Search Users</DrawerHeader>

          <DrawerBody>
            <Box d="flex" pb={2}>
              <Input
                placeholder="search by name or email"
                mr={2}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button onClick={handleSearch}>Go</Button>
            </Box>
            {loading && !searchResult ? (
              <ChatLoading />
            ) : (
              searchResult?.map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => accessChat(user._id)}
                />
              ))
            )}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default SideDrawer;
