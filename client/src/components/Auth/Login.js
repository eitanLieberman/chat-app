import React, { useState } from "react";
import { Stack, HStack, VStack, useToast } from "@chakra-ui/react";
import { Button } from "@chakra-ui/button";
import { Input, InputGroup, InputRightElement } from "@chakra-ui/input";
import { FormControl, FormLabel } from "@chakra-ui/form-control";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { getChats, login } from "../../redux/apiCalls";
import { useSelector } from "react-redux";
import { Link, NavLink } from "react-router-dom";
function Login() {
  const toast = useToast();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const history = useNavigate();
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();

  const [show, setShow] = useState(false);
  let loginErr = null;

  const submitHandler = async (e) => {
    try {
      e.preventDefault();
      await login(dispatch, { username, email, password });
    } catch (err) {
      toast({
        title: "Oops!",
        description: err,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };
  return (
    <VStack>
      <FormControl id="name" isRequired>
        <FormLabel>Name</FormLabel>
        <Input
          placeholder="enter name/email"
          onChange={(e) => {
            setUsername(e.target.value);
          }}
        ></Input>
      </FormControl>

      <FormControl id="password" isRequired>
        <FormLabel>password</FormLabel>
        <InputGroup>
          <Input
            type={!show ? "password" : "text"}
            placeholder="enter password"
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
          <InputRightElement>
            <Button
              onClick={() => {
                show ? setShow(null) : setShow(true);
              }}
            >
              {show ? "hide" : "show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <a href="chats">
        <Button
          colorScheme="teal"
          width="100%"
          style={{ marginTop: 15 }}
          onClick={submitHandler}
        >
          Login
        </Button>
      </a>
    </VStack>
  );
}

export default Login;
