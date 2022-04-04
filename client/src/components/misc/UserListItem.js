import React from "react";
import { useSelector } from "react-redux";
import { Avatar } from "@chakra-ui/avatar";
import { Box, Text } from "@chakra-ui/layout";

const UserListItem = ({ handleFunction, user, selectedUsers }) => {
  // const user = useSelector((state) => state.user.currentUser);
  return (
    <Box
      onClick={handleFunction}
      cursor="pointer"
      bg={selectedUsers?.includes(user) ? "#38B2AC" : "#E8E8E8"}
      _hover={{
        background: "#38B2AC",
        color: "white",
      }}
      w="100%"
      d="flex"
      alignItems="center"
      color="black"
      px={3}
      py={2}
      mb={2}
      borderRadius="lg"
    >
      <Avatar
        mr={2}
        size="sm"
        cursor="pointer"
        name={user.name}
        src={user.pic}
      />
      <Box>
        <Text>{user.username}</Text>
        <Text fontSize="xs">
          <b>Email : </b>
          {user.email}
        </Text>
      </Box>
    </Box>
  );
};

export default UserListItem;
