import Todo from "./component/Todo";
import { Route, Routes } from "react-router";
import Login from "./component/Login";
import Sign from "./component/Sign";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Sign />} />
        <Route path="/login" element={<Login />} />
        <Route path="/todo" element={<Todo />} />
      </Routes>
    </div>
  );
}

export default App;
