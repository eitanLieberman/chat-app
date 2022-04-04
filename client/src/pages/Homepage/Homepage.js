import { Container } from "@chakra-ui/layout";
import { TabList, Tabs, Tab, TabPanel, TabPanels } from "@chakra-ui/tabs";
import { Box, Text } from "@chakra-ui/react";
import React, { useState } from "react";
import { logoutUser } from "../../redux/apiCalls";
import { Link } from "react-router-dom";
import "./Join.css";
import { useNavigate } from "react-router-dom";
import { Button } from "@chakra-ui/button";
import Login from "../../components/Auth/Login";
import Signup from "../../components/Auth/Signup";
import { useDispatch } from "react-redux";
const Homepage = () => {
  const dispatch = useDispatch();

  const history = useNavigate();
  const handleClick = async (e) => {
    await logoutUser(dispatch);
  };
  return (
    <Container maxW="xl" centerContent>
      <Box
        // justifyContent="center"
        d="flex"
        p={3}
        bg={"white"}
        w="100%"
        m="40px 0 15px 0"
        borderRadius="1g"
        borderWidth="1px"
      >
        <Button onClick={handleClick} style={{ float: "right" }}>
          logout
        </Button>
        <Text
          style={{ textAlign: "center", marginRight: "-50%" }}
          fontSize="4xl"
        >
          Talks
        </Text>
      </Box>
      <Box bg="white" w="100%" p={4} borderRadius="1g" borderWidth="1px">
        <Tabs variant="soft-rounded" colorScheme="teal">
          <TabList>
            <Tab width="50%">LOGIN</Tab>
            <Tab width="50%">SIGNUP</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Login />
            </TabPanel>
            <TabPanel>
              <Signup />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  );
};

export default Homepage;
