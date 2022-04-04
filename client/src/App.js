import React from "react";

import { ChakraProvider } from "@chakra-ui/react";
import { Button } from "@chakra-ui/button";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Navigate,
  Link,
  Routes,
} from "react-router-dom";
import Chat from "./pages/Chat/Chat";
import Homepage from "./pages/Homepage/Homepage";
import "./App.css";
import { useSelector } from "react-redux";
const App = () => {
  const user = useSelector((state) => state.user.currentUser);

  return (
    <div className="App">
      <Routes>
        <Route
          path="/"
          element={!user ? <Homepage /> : <Navigate to="/chats" />}
          exact
        />
        <Route
          path="/chats"
          element={user ? <Chat /> : <Navigate to="/" />}
          exact
        />
      </Routes>
    </div>
  );
};

export default App;
