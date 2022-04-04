import React, { useState } from "react";
import { Stack, HStack, VStack } from "@chakra-ui/react";

import axios from "axios";
import { useDispatch } from "react-redux";
import { register, login } from "../../redux/apiCalls";
import { useToast } from "@chakra-ui/toast";
import { Button } from "@chakra-ui/button";
import { Input, InputGroup, InputRightElement } from "@chakra-ui/input";
import { FormControl, FormLabel } from "@chakra-ui/form-control";
import { useNavigate } from "react-router";

function Signup() {
  const toast = useToast();
  const [show, setShow] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pic, setPic] = useState();
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const postDetails = async (pics) => {
    console.log(pics);
    if (pics === undefined) {
      toast({
        title: "please select an image",

        status: "warning",
        duration: 9000,
        isClosable: true,
        position: "bottom",
      });
      return;
    } else {
      setLoading(true);
      const data = new FormData();
      data.append("file", pics);
      data.append("upload_preset", "chat-app");
      data.append("cloud_name", "fj4ni3h5hjvgy");
      const postPic = await fetch(
        "https://api.cloudinary.com/v1_1/fj4ni3h5hjvgy/image/upload",
        {
          method: "post",
          body: data,
        }
      );
      console.log(postPic);
      const picJson = await postPic.json();
      console.log(picJson);
      console.log(typeof picJson.url.toString());
      const picUrl = picJson.url.toString();
      await setPic(picUrl);

      console.log(pic);
      setLoading(false);
      toast({
        title: "pic was uploaded",

        status: "success",
        duration: 9000,
        isClosable: true,
        position: "bottom",
      });
    }
  };
  const history = useNavigate();
  const submitHandler = async (e) => {
    e.preventDefault();
    await register(dispatch, { username, email, password, pic });
    await login(dispatch, { username, email, password });
    history("/chats");
  };

  return (
    <VStack spacing="5px">
      <FormControl id="nameS" isRequired>
        <FormLabel>Name</FormLabel>
        <Input
          placeholder="enter name"
          onChange={(e) => {
            setUsername(e.target.value);
          }}
        ></Input>
      </FormControl>
      <FormControl id="emailS" isRequired>
        <FormLabel>Email</FormLabel>
        <Input
          placeholder="enter Email"
          onChange={(e) => {
            setEmail(e.target.value);
          }}
        ></Input>
      </FormControl>
      <FormControl id="passwordS" isRequired>
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
      <FormControl id="pic" isRequired>
        <FormLabel>upload a picture</FormLabel>
        <Input
          type="file"
          onChange={(e) => {
            postDetails(e.target.files[0]);
          }}
        ></Input>
      </FormControl>
      <Button
        colorScheme="teal"
        width="100%"
        style={{ marginTop: 15 }}
        onClick={submitHandler}
        isLoading={loading}
      >
        SIGN UP!
      </Button>
    </VStack>
  );
}

export default Signup;
