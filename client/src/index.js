import { ChakraProvider } from "@chakra-ui/react";
import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { BrowserRouter as Router } from "react-router-dom";
import { Provider } from "react-redux";
// import { default as ChatProvider } from "./context/ChatProvider";
import { persistor, store } from "./redux/store";
import { PersistGate } from "redux-persist/integration/react";
ReactDOM.render(
  <Provider store={store}>
    {/* <ChatProvider> */}
    <PersistGate loading={null} persistor={persistor}>
      <React.StrictMode>
        <Router>
          <ChakraProvider>
            <App />
          </ChakraProvider>
        </Router>
      </React.StrictMode>
    </PersistGate>
    {/* </ChatProvider> */}
  </Provider>,
  document.getElementById("root")
);
