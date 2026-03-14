import { useEffect, useState } from "react";
import { getAuth, signOut } from "firebase/auth";
import { db } from "../firebase/config";
import { useNavigate } from "react-router-dom";
import { addDoc, collection, onSnapshot, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiPlus, FiTrash2, FiEdit3, FiCheck, FiLogOut,
  FiSearch, FiSun, FiMoon, FiClipboard,
} from "react-icons/fi";

const FILTERS = ["All", "Active", "Completed"];

export default function Todo() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [dark, setDark] = useState(true);
  const [loading, setLoading] = useState(false);

  const auth = getAuth();
  const user = auth.currentUser;
  const navigate = useNavigate();
  const todoRef = collection(db, "todo-list");

  useEffect(() => {
    const unsub = onSnapshot(todoRef, (snapshot) => {
      const list = snapshot.docs
        .map((d) => ({ id: d.id, ...d.data() }))
        .sort((a, b) => b.createdAt - a.createdAt);
      setTodos(list);
    });
    return () => unsub();
  }, []);

  const handleAdd = async () => {
    if (!newTodo.trim()) { toast.error("Task cannot be empty"); return; }
    setLoading(true);
    try {
      if (editId) {
        await updateDoc(doc(db, "todo-list", editId), { text: newTodo });
        toast.success("Task updated");
        setEditId(null);
      } else {
        await addDoc(todoRef, { text: newTodo, completed: false, createdAt: Date.now(), userId: user?.uid });
        toast.success("Task added");
      }
      setNewTodo("");
    } catch { toast.error("Something went wrong"); }
    finally { setLoading(false); }
  };

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, "todo-list", id));
    toast.success("Task deleted");
  };

  const handleEdit = (id, text) => { setEditId(id); setNewTodo(text); };

  const handleToggle = async (id, completed) => {
    await updateDoc(doc(db, "todo-list", id), { completed: !completed });
  };

  const handleKeyDown = (e) => { if (e.key === "Enter") handleAdd(); };

  const cancelEdit = () => { setEditId(null); setNewTodo(""); };

  const filtered = todos.filter((t) => {
    const matchSearch = t.text?.toLowerCase().includes(search.toLowerCase());
    if (filter === "Active") return matchSearch && !t.completed;
    if (filter === "Completed") return matchSearch && t.completed;
    return matchSearch;
  });

  const logout = async () => {
    await signOut(auth);
    toast.success("Logged out");
    navigate("/");
  };

  const bg = dark
    ? "min-h-screen bg-gradient-to-br from-gray-950 via-slate-900 to-gray-900"
    : "min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100";

  const card = dark
    ? "backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl shadow-2xl"
    : "bg-white/80 backdrop-blur-xl border border-white/60 rounded-3xl shadow-2xl";

  const text = dark ? "text-white" : "text-gray-800";
  const sub = dark ? "text-white/50" : "text-gray-500";
  const inputCls = dark
    ? "bg-white/10 border border-white/20 text-white placeholder-white/30 focus:ring-violet-400"
    : "bg-white border border-gray-200 text-gray-800 placeholder-gray-400 focus:ring-violet-400";

  return (
    <div className={bg}>
      <div className="max-w-2xl mx-auto px-4 py-10">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-8">
          <div>
            <h1 className={`text-3xl font-bold ${text}`}>My Tasks</h1>
            <p className={`text-sm mt-1 ${sub}`}>Welcome back, <span className="text-violet-400 font-medium">{user?.displayName || "User"}</span></p>
          </div>
          <div className="flex items-center gap-2">
            <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
              onClick={() => setDark(!dark)}
              className={`p-2.5 rounded-xl ${dark ? "bg-white/10 text-yellow-300 hover:bg-white/20" : "bg-gray-200 text-gray-600 hover:bg-gray-300"} transition`}>
              {dark ? <FiSun size={18} /> : <FiMoon size={18} />}
            </motion.button>
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              onClick={logout}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/30 transition text-sm font-medium">
              <FiLogOut size={16} /> Logout
            </motion.button>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
          className="grid grid-cols-3 gap-3 mb-6">
          {[
            { label: "Total", value: todos.length, color: "from-violet-500 to-indigo-500" },
            { label: "Active", value: todos.filter(t => !t.completed).length, color: "from-rose-500 to-pink-500" },
            { label: "Done", value: todos.filter(t => t.completed).length, color: "from-emerald-500 to-teal-500" },
          ].map(s => (
            <div key={s.label} className={`${card} p-4 text-center`}>
              <div className={`text-2xl font-bold bg-gradient-to-r ${s.color} bg-clip-text text-transparent`}>{s.value}</div>
              <div className={`text-xs mt-1 ${sub}`}>{s.label}</div>
            </div>
          ))}
        </motion.div>

        {/* Input */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          className={`${card} p-4 mb-4`}>
          <div className="flex gap-3">
            <input
              type="text"
              placeholder={editId ? "Edit your task..." : "Add a new task..."}
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              onKeyDown={handleKeyDown}
              className={`flex-1 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 transition ${inputCls}`}
            />
            {editId && (
              <motion.button whileTap={{ scale: 0.95 }} onClick={cancelEdit}
                className="px-4 py-3 rounded-xl bg-gray-500/20 text-gray-400 hover:bg-gray-500/30 transition text-sm">
                Cancel
              </motion.button>
            )}
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              onClick={handleAdd} disabled={loading}
              className="px-5 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-violet-500 to-indigo-500 hover:from-violet-600 hover:to-indigo-600 shadow-lg shadow-violet-500/30 transition flex items-center gap-2 text-sm disabled:opacity-60">
              {loading
                ? <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                : editId ? <><FiCheck size={16} /> Update</> : <><FiPlus size={16} /> Add</>}
            </motion.button>
          </div>
        </motion.div>

        {/* Search + Filter */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
          className={`${card} p-4 mb-6`}>
          <div className="relative mb-3">
            <FiSearch className={`absolute left-3 top-1/2 -translate-y-1/2 ${sub}`} />
            <input type="text" placeholder="Search tasks..." value={search} onChange={(e) => setSearch(e.target.value)}
              className={`w-full rounded-xl pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 transition ${inputCls}`} />
          </div>
          <div className="flex gap-2">
            {FILTERS.map(f => (
              <button key={f} onClick={() => setFilter(f)}
                className={`flex-1 py-2 rounded-xl text-sm font-medium transition ${filter === f
                  ? "bg-gradient-to-r from-violet-500 to-indigo-500 text-white shadow-md"
                  : dark ? "bg-white/10 text-white/60 hover:bg-white/20" : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`}>
                {f}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Todo List */}
        <AnimatePresence mode="popLayout">
          {filtered.length === 0 ? (
            <motion.div key="empty" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
              className={`${card} p-12 text-center`}>
              <FiClipboard className={`mx-auto text-5xl mb-4 ${sub}`} />
              <p className={`text-lg font-medium ${text}`}>No tasks here</p>
              <p className={`text-sm mt-1 ${sub}`}>{filter === "All" ? "Add your first task above" : `No ${filter.toLowerCase()} tasks`}</p>
            </motion.div>
          ) : (
            filtered.map((todo, i) => (
              <motion.div key={todo.id}
                initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20, scale: 0.95 }}
                transition={{ delay: i * 0.04 }}
                layout
                className={`${card} p-4 mb-3 flex items-center gap-3 group`}>
                {/* Checkbox */}
                <motion.button whileTap={{ scale: 0.85 }} onClick={() => handleToggle(todo.id, todo.completed)}
                  className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition ${todo.completed
                    ? "bg-gradient-to-br from-emerald-400 to-teal-500 border-transparent"
                    : dark ? "border-white/30 hover:border-violet-400" : "border-gray-300 hover:border-violet-400"}`}>
                  {todo.completed && <FiCheck className="text-white text-xs" />}
                </motion.button>

                {/* Text */}
                <span className={`flex-1 text-sm transition-all duration-300 ${todo.completed
                  ? `line-through ${sub}` : text}`}>
                  {todo.text}
                </span>

                {/* Actions */}
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                    onClick={() => handleEdit(todo.id, todo.text)}
                    className="p-2 rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition">
                    <FiEdit3 size={14} />
                  </motion.button>
                  <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                    onClick={() => handleDelete(todo.id)}
                    className="p-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition">
                    <FiTrash2 size={14} />
                  </motion.button>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
