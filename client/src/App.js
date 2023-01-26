import React, {Fragment} from "react";
import './App.css';
import Navbar from "./components/layout/Navbar";
import Landing from "./components/layout/Landing";
import {BrowserRouter, Route, Routes, Switch} from "react-router-dom";
import Register from "./components/auth/Register";
import Login from "./components/auth/Login";
//Redux
import {Provider} from "react-redux";
import store from "./redux/store";

function App() {
  return (
      <Provider store={store}>
      <BrowserRouter>
          <Navbar/>
          <Routes>
          <Fragment>

              <Route path="/" element={<Landing/>}></Route>
              <Route path="/register" element={<Register/>}></Route>
              <Route path="/login" element={<Login/>}></Route>

          </Fragment>
          </Routes>
      </BrowserRouter>
      </Provider>
  );
}

export default App;
