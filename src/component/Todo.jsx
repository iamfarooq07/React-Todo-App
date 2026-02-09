import { useEffect, useState } from "react";
import { getAuth, signOut } from "firebase/auth";
import { db } from "../firebase/config";
import { useNavigate } from "react-router-dom";
import {
  addDoc,
  collection,
  onSnapshot,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { toast } from "react-toastify";

function Todo() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState("");

  const auth = getAuth();
  const user = auth.currentUser;
  const navigate = useNavigate();
  const todoRef = collection(db, "todo-list");

  // ================================
  //   READ TODOS (REALTIME)
  // ================================
  useEffect(() => {
    const unsub = onSnapshot(todoRef, (snapshot) => {
      const list = snapshot.docs
        .map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
        .sort((a, b) => b.createdAt - a.createdAt);

      setTodos(list);
    });

    return () => unsub();
  }, [todoRef]);

  // ================================
  //      ADD / UPDATE TODO
  // ================================
  const handleAdd = async () => {
    if (!newTodo.trim()) {
      toast.error("Todo cannot be empty");
      return;
    }

    try {
      if (editId) {
        await updateDoc(doc(db, "todo-list", editId), {
          text: newTodo,
        });
        setEditId(null);
      } else {
        await addDoc(todoRef, {
          text: newTodo,
          createdAt: Date.now(),
          userId: user?.uid,
        });
      }

      setNewTodo("");
    } catch {
      toast.error("Something went wrong");
    }
  };

  // ================================
  //          DELETE
  // ================================
  const handleDelete = async (id) => {
    await deleteDoc(doc(db, "todo-list", id));
  };

  // ================================
  //          EDIT
  // ================================
  const handleEdit = (id, text) => {
    setEditId(id);
    setNewTodo(text);
  };

  // ================================
  //          SEARCH
  // ================================
  const filteredTodos = todos.filter((todo) =>
    todo.text?.toLowerCase().includes(search.toLowerCase()),
  );

  // ================================
  //          LOGOUT
  // ================================
  const logout = async () => {
    await signOut(auth);
    toast.success("Logged out", {
      autoClose: 2000,
    });
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-200 to-blue-300 flex justify-center items-center p-4">
      <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl p-6">
        {/* Header */}
        <div className="flex justify-between items-center border-b pb-4 mb-6">
          <div>
            <h1 className="text-3xl font-extrabold text-blue-700 ">Todo App</h1>
            <p className="text-gray-600 mt-2">
              Welcome,{" "}
              <span className="font-semibold text-blue-600">
                {user?.displayName || "User"}
              </span>
            </p>
          </div>

          <button
            onClick={logout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
          >
            Logout
          </button>
        </div>

        {/* Add Todo */}
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            placeholder="Write a new task..."
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            className="flex-1 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleAdd}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 rounded-lg"
          >
            {editId ? "Update" : "Add"}
          </button>
        </div>

        {/* Search */}
        <input
          type="text"
          placeholder="Search todos..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full p-3 border rounded-lg mb-6"
        />

        {/* Todo List */}
        <div className="space-y-3">
          {(search ? filteredTodos : todos).map((todo) => (
            <div
              key={todo.id}
              className="flex justify-between items-center bg-blue-50 p-3 rounded-lg"
            >
              <span className="text-lg">{todo.text}</span>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(todo.id, todo.text)}
                  className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(todo.id)}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}

          {todos.length === 0 && (
            <p className="text-center text-gray-500 py-6">
              No todos yet. Add your first task ✨
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Todo;
