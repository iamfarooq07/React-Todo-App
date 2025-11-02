import { useState } from "react";

function App() {
  const [todos, setTodos] = useState([]);
  const [newtodos, setNewtodos] = useState("");
  const [editId, setEditId] = useState("");
  const [search, setSearch] = useState("");

  function handleAdd() {
    if (editId) {
      setTodos(
        todos.map((todo) =>
          todo.id === editId ? { ...todo, text: newtodos } : todo
        )
      );
      setEditId(null);
      setNewtodos("");
    } else {
      if (newtodos.trim() === "") return;
      setTodos([...todos, { id: Date.now(), text: newtodos }]);
      setNewtodos("");
    }
  }

  function handleDelete(id) {
    setTodos(todos.filter((del) => del.id !== id));
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
    <div className="min-h-screen bg-blue-200 flex justify-center items-center">
      <div className="bg-white shadow-2xl rounded-2xl w-[90%] sm:w-[60%] md:w-[40%] p-6">
        <h1 className="text-4xl font-extrabold text-center text-blue-700 mb-6">
          React Todo App
        </h1>

        <div className="flex gap-2 mb-4">
          <input
            type="text"
            placeholder="Write a task..."
            value={newtodos}
            onChange={(e) => setNewtodos(e.target.value)}
            className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleAdd}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            {editId ? "Update" : "Add"}
          </button>
        </div>

        <input
          type="text"
          placeholder="Search task..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-lg mb-6 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <div className="space-y-3">
          {(search ? searchText : todos).length === 0 ? (
            <p className="text-center text-gray-500">No tasks found</p>
          ) : (
            (search ? searchText : todos).map((todo) => (
              <div
                key={todo.id}
                className="flex justify-between items-center bg-blue-50 border border-blue-200 p-3 rounded-lg"
              >
                <h3 className="text-lg font-medium text-gray-800">
                  {todo.text}
                </h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(todo.id)}
                    className="text-yellow-600 hover:text-yellow-700 font-semibold"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(todo.id)}
                    className="text-red-600 hover:text-red-700 font-semibold"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
