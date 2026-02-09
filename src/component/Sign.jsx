import React, { useState } from "react";
import { Link } from "react-router-dom";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../firebase/config";
import { toast } from "react-toastify";
import NameInput from "./NameInput";

function Sign() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function signup(e) {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Name is required");
      return;
    }

    try {
      const userCred = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );

      await updateProfile(userCred.user, {
        displayName: name,
      });

      toast.success("User Created Successfully", {
        autoClose: 2000,
      });

      setName("");
      setEmail("");
      setPassword("");
    } catch (err) {
      toast.error(err.message, {
        autoClose: 1000,
      });
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-800 p-4">
      <div className="bg-black p-8 rounded-3xl w-full max-w-md">
        <h1 className="text-5xl font-bold text-center text-gray-300 mb-6">
          Sign Up
        </h1>

        <form className="space-y-6" onSubmit={signup}>
          <NameInput value={name} onChange={setName} />

          <div>
            <label className="block mb-2  text-lg text-gray-300">Email</label>
            <input
              type="email"
              placeholder="Enter Email"
              className="border p-3 rounded-lg w-full bg-white"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block mb-2 text-lg text-gray-300">Password</label>
            <input
              type="password"
              placeholder="Enter Password"
              className="border p-3 rounded-lg w-full bg-white"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button className="bg-gray-600 p-3 rounded-lg w-full text-white">
            Sign Up
          </button>
        </form>

        <p className="text-center mt-4 text-gray-400">
          Already have an account?{" "}
          <Link to="/login" className="text-indigo-500">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Sign;
