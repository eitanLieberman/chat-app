// import { createContext, useContext, useEffect, useState } from "react";
// import { useNavigate } from "react-router";

// const ChatContext = createContext();

// const ChatProvider = ({ children }) => {
//   const [userData, setUserData] = useState("");
//   const user = JSON.parse(localStorage.getItem("persist:root"))?.user;
//   const currentUser = user && JSON.parse(user).currentUser;
//   console.log(currentUser);

//   useEffect(() => {}, []);

//   return (
//     <ChatContext.Provider value={{ user, setUserData }}>
//       {children}
//     </ChatContext.Provider>
//   );
// };
// useContext(ChatContext);
// export default ChatProvider;
