import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import { ProfileProvider } from "./context/ProfileContext";
import { ShortlistProvider } from "./context/ShortlistContext";
import "./styles.css";
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode><BrowserRouter><AuthProvider><ProfileProvider><ShortlistProvider><App /></ShortlistProvider></ProfileProvider></AuthProvider></BrowserRouter></React.StrictMode>);
