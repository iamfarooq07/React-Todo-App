import { useState } from "react";
import Todo from "./component/todo";
import { Route, Routes } from "react-router";
import Login from "./component/Login";
import Sign from "./component/Sign";

function App() {
  return (
    <div>
      {/* <Todo /> */}
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/SignUp" element={<Sign />} />
        <Route path="/todo" element={<Todo />} />
      </Routes>
    </div>
  );
}

export default App;
