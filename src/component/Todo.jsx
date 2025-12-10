import { useEffect, useState } from "react";
import { db } from "../firebase/config";
import { useNavigate } from "react-router";
import {
  addDoc,
  collection,
  onSnapshot,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";

function Todo() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState("");

  const todoRef = collection(db, "todo-list");

  // ================================
  //   READ TODOS (REALTIME)
  // ================================
  useEffect(() => {
    const unsub = onSnapshot(todoRef, (snapshot) => {
      const list = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTodos(list);
    });

    return () => unsub();
  }, []);

  // ================================
  //      ADD OR UPDATE TODO
  // ================================
  const handleAdd = async () => {
    if (newTodo.trim() === "") return;

    if (editId) {
      // UPDATE FIREBASE
      await updateDoc(doc(db, "todo-list", editId), {
        text: newTodo,
      });

      setEditId(null);
    } else {
      // ADD TO FIREBASE
      await addDoc(todoRef, {
        text: newTodo,
        createdAt: Date.now(),
      });
    }

    setNewTodo("");
  };

  // ================================
  //          DELETE TODO
  // ================================
  const handleDelete = async (id) => {
    await deleteDoc(doc(db, "todo-list", id));
  };

  // ================================
  //          EDIT TODO
  // ================================
  const handleEdit = (id, text) => {
    setEditId(id);
    setNewTodo(text);
  };

  const searchText = todos.filter((todo) =>
    todo.text.toLowerCase().includes(search.toLowerCase())
  );
  // ================================

  const navigate = useNavigate();
  function logout() {
    signOut(auth)
      .then(() => {
        console.log("User logged out");
        navigate("/");
      })
      .catch((err) => {
        console.log("Logout error:", err.message);
      });
  }
  return (
    <div className="min-h-screen bg-blue-200 flex justify-center items-center">
      <div className="bg-white shadow-2xl rounded-2xl w-[90%] sm:w-[60%] md:w-[40%] p-6">
        <div className="flex justify-between items-center">
          <h1 className="text-4xl font-extrabold text-blue-700 mb-6">
            React Todo App
          </h1>
          <button
            onClick={logout}
            className="bg-blue-500 text-white px-4 py-2 rounded-2xl"
          >
            Logout
          </button>
        </div>

        <div className="flex gap-2 mb-4">
          <input
            type="text"
            placeholder="Write a task..."
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleAdd}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            {editId ? "Update" : "Add"}
          </button>
        </div>

        <input
          type="text"
          placeholder="Search task..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-lg mb-6 focus:ring-2 focus:ring-blue-500"
        />

        <div className="space-y-3">
          {(search ? searchText : todos).map((todo) => (
            <div
              key={todo.id}
              className="flex justify-between items-center bg-blue-50 border border-blue-200 p-3 rounded-lg"
            >
              <h3 className="text-lg font-medium text-gray-800">{todo.text}</h3>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(todo.id, todo.text)}
                  className="bg-green-500 text-white p-1 px-2 rounded-lg"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(todo.id)}
                  className="bg-red-500 text-white p-1 px-2 rounded-lg"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}

          {todos.length === 0 && (
            <p className="text-center text-gray-500">No todos found</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Todo;
