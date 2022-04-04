import { FormControl } from "@chakra-ui/form-control";
import { Input, InputGroup, InputRightElement } from "@chakra-ui/input";
import { Box, Text } from "@chakra-ui/layout";
import { Avatar } from "@chakra-ui/avatar";
import { IconButton, Spinner, useToast, Button } from "@chakra-ui/react";
import { getSender, getSenderFull } from "../../config/ChatLogics";
import { useEffect, useState } from "react";
import axios from "axios";
import { ArrowBackIcon } from "@chakra-ui/icons";
import ProfileModal from "./ProfileModal";
import { backToContacts } from "../../redux/chatRedux";
import { useDispatch, useSelector } from "react-redux";
import { ArrowRightIcon } from "@chakra-ui/icons";
import UpdateGroupChatModal from "./UpdateGroupChatModal";
import { userRequest } from "../../requestMethods";
import ScrollableChat from "./ScrollableChat";
import { newNotification } from "../../redux/chatRedux";
import io from "socket.io-client";
const ENDPOINT = "http://localhost:8080";
var socket, selectedChatCompare;
const SingleChat = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [not, setNot] = useState([]);
  const [istyping, setIsTyping] = useState(false);
  const toast = useToast();
  const user = useSelector((state) => state.user.currentUser);
  const { selectedChat, chats, notifications } = useSelector(
    (state) => state.chat
  );
  console.log(selectedChat);
  const dispatch = useDispatch();
  const backHandler = async (e) => {
    console.log("click");
    await dispatch(backToContacts());
  };

  const fetchMessages = async () => {
    setLoading(true);
    if (!selectedChat) {
      return;
    }
    const config = {
      headers: { token: `Bearer ${user.accessToken}` },
    };
    const { data } = await axios.get(
      `/api/messages/${selectedChat._id}`,
      config
    );
    setMessages(data);

    setLoading(false);
    socket.emit("join chat", selectedChat._id);
  };

  const sendMessage = async (e) => {
    console.log(e.type);
    if ((e.key === "Enter" || e.type === "click") && newMessage) {
      try {
        setNewMessage("");
        const config = {
          headers: { token: `Bearer ${user.accessToken}` },
        };
        const { data } = await axios.post(
          "/api/messages",
          {
            chatId: selectedChat._id,
            content: newMessage,
          },
          config
        );
        console.log(data);
        socket.emit("new message", data);
        setMessages([...messages, data]);
        // await fetchMessages();
      } catch (err) {
        console.log(err);
      }
    }
  };
  console.log(not);
  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));
  }, []);
  useEffect(() => {
    fetchMessages();
    selectedChatCompare = selectedChat;
  }, [selectedChat]);

  useEffect(() => {
    console.log(istyping);
    socket.on("message received", async (newMessageReceived) => {
      console.log(!notifications.includes({ newMessageReceived }));
      // console.log(newMessageReceived._id === not[0]._id);
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== newMessageReceived.chat._id
      ) {
        if (!notifications.includes({ newMessageReceived })) {
          console.log("go------------");
          setNot([newMessageReceived]);
          dispatch(newNotification([newMessageReceived, ...notifications]));
        }
      } else {
        setMessages([...messages, newMessageReceived]);
        console.log(messages);
      }
    });
  });

  const typingHandler = (e) => {
    setNewMessage(e.target.value);
    console.log("handlingtype");
    console.log(socketConnected);
    if (!socketConnected) return;

    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }
    console.log(typing);
    let lastTypingTime = new Date().getTime();
    var timerLength = 3000;
    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, timerLength);
  };
  return (
    <>
      {selectedChat ? (
        <>
          <Text
            fontSize={{ base: "28px", md: "30px" }}
            pb={3}
            px={2}
            w="100%"
            fontFamily="Work sans"
            d="flex"
            justifyContent={{ base: "space-between" }}
            alignItems="center"
          >
            <IconButton
              d={{ base: "flex", md: "none" }}
              icon={<ArrowBackIcon />}
              onClick={backHandler}
            />
            <Avatar src={getSenderFull(user, selectedChat?.users)?.pic} />
            {messages &&
              (!selectedChat.isGroupChat ? (
                <>
                  {getSender(user, selectedChat.users)}
                  <ProfileModal
                    user={getSenderFull(user, selectedChat.users)}
                  />
                </>
              ) : (
                <>
                  {selectedChat.chatName.toUpperCase()}
                  <UpdateGroupChatModal />
                </>
              ))}
          </Text>
          <Box
            d="flex"
            flexDir="column"
            justifyContent="flex-end"
            p={3}
            bg="#E8E8E8"
            w="100%"
            h="100%"
            borderRadius="lg"
            overflowY="hidden"
          >
            {loading ? (
              <Spinner
                size="xl"
                w={20}
                h={20}
                alignSelf="center"
                margin="auto"
              />
            ) : (
              <div className="messages">
                <ScrollableChat
                  messages={messages}
                  users={selectedChat.users}
                />
              </div>
            )}

            <FormControl
              onKeyDown={sendMessage}
              id="first-name"
              isRequired
              mt={3}
            >
              {istyping ? <div>typing...</div> : <></>}
              <InputGroup>
                <Input
                  variant="filled"
                  bg="#E0E0E0"
                  placeholder="Enter a message.."
                  value={newMessage}
                  onChange={typingHandler}
                />
                <InputRightElement
                  children={
                    <IconButton
                      bg="teal"
                      icon={<ArrowRightIcon color="white" />}
                      onClick={sendMessage}
                    />
                  }
                />
              </InputGroup>
            </FormControl>
          </Box>
        </>
      ) : (
        // to get socket.io on same page
        <Box d="flex" alignItems="center" justifyContent="center" h="100%">
          <Text fontSize="3xl" pb={3} fontFamily="Work sans">
            Click on a user to start chatting
          </Text>
        </Box>
      )}
    </>
  );
};

export default SingleChat;