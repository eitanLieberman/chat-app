import { CloseIcon } from "@chakra-ui/icons";
import { Badge } from "@chakra-ui/layout";
import { Tooltip } from "@chakra-ui/react";
import { useDispatch } from "react-redux";
import { getSenderFull } from "../../config/ChatLogics";
import { startChat } from "../../redux/apiCalls";

const UserBadgeItem = ({ user, handleFunction, admin, thisUser }) => {
  const dispatch = useDispatch();
  const handleStartChat = async () => {
    if (thisUser._id === user._id) {
      return;
    }
    await startChat(dispatch, user, thisUser.accessToken);
  };
  return (
    <Tooltip
      label={thisUser && `click to message`}
      hasArrow
      placement="bottom-end"
    >
      <Badge
        px={2}
        py={1}
        borderRadius="lg"
        m={1}
        mb={2}
        variant="solid"
        fontSize={12}
        colorScheme="purple"
        cursor="pointer"
        onClick={handleStartChat}
      >
        {user.username}
        {admin === user._id && <span> (Admin)</span>}
        <CloseIcon pl={1} onClick={handleFunction} />
      </Badge>
    </Tooltip>
  );
};

export default UserBadgeItem;
