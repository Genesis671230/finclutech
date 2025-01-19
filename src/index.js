import "./index.css";
import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import "assets/css/App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import "./index.css"
import AuthLayout from "layouts/auth";
import AdminLayout from "layouts/admin";
import UserLayout from "layouts/user";
import { ChakraProvider } from "@chakra-ui/react";
import theme from "theme/theme";
import { ThemeEditorProvider } from "@hypertheme-editor/chakra-ui";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {Provider} from "react-redux"
import store  from "./redux/store/store"
import { fetchUsersAsync } from "features/users/userSlice";
store.dispatch(fetchUsersAsync())
function App() {
  const token =
    localStorage.getItem("token") || sessionStorage.getItem("token")||"h21ur1gr9712rh172rh1";

  const user = JSON.parse(localStorage.getItem("user"))
  // || {role:"admin"};
  useNavigate();

  return (
    <>
      <ToastContainer />
      <Routes>
        {token && user?.role ? (
          user?.role == "user"||user?.role == "agent" ? (
            <Route path="/*" element={<UserLayout />} />
          ) : user?.role === "admin" ? (
            <Route path="/*" element={<AdminLayout />} />
          ) : (
            ""
          )
        ) : (
          <Route path="/*" element={<AuthLayout />} />
        )}
      </Routes>
    </>
  );
}
const root = createRoot(document.getElementById("root"));
root.render(
  <ChakraProvider theme={theme}>
    <Provider store={store}>

    <React.StrictMode>
      <ThemeEditorProvider>
        <Router>
          <App />
        </Router>
      </ThemeEditorProvider>
    </React.StrictMode>
    </Provider>
  </ChakraProvider>
);