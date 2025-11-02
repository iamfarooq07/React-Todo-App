import { useState } from "react";

function App() {
  const [todos, setTodos] = useState([]);
  const [newtodos, setNewtodos] = useState("");
  const [editId, setEditId] = useState("");
  const [search, setSearch] = useState("");

  console.log(todos);

  function handleAdd() {
    if (editId) {
      setTodos(
        todos.map((todo) => {
          return todo.id === editId ? { ...todo, text: newtodos } : todo;
        })
      );

      setEditId(null);
      setNewtodos("");
    } else {
      setTodos([...todos, { id: Date.now(), text: newtodos }]);
      setNewtodos("");
    }
  }

  function handleDelete(id) {
    console.log(id);

    setTodos(todos.filter((del) => del.id != id));
  }

  function handleEdit(id) {
    setEditId(id);
    let todo = todos.find((todo) => todo.id === id);
    setNewtodos(todo.text);
  }

  let searchText = todos.filter((todo) =>
    todo.text.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <input
        type="text"
        placeholder="Write A Task"
        value={newtodos}
        onChange={(e) => setNewtodos(e.target.value)}
      />
      <button onClick={handleAdd}>{editId ? "Update" : "Add"}</button>
      <input
        type="text"
        placeholder="Search task..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      {(search ? searchText : todos).map((todo) => (
        <div key={todo.id}>
          <h3>{todo.text}</h3>
          <button onClick={() => handleEdit(todo.id)}>Edit</button>
          <button onClick={() => handleDelete(todo.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}

export default App;
