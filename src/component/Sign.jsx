import React, { useState } from "react";
import { Link } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/config";

function Sign() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function signup(e) {
    e.preventDefault();

    createUserWithEmailAndPassword(auth, email, password)
      .then((userCred) => {
        console.log("User created:", userCred.user);
      })
      .catch((err) => {
        console.log("Error:", err.message);
      });
  }

  return (
    <div className="flex justify-center items-center min-h-screen w-full bg-gray-800  p-4">
      <div className="grid gap-8 w-full max-w-md">
        <section className="rounded-3xl p-2">
          <div className="rounded-3xl bg-black shadow-xl p-8">
            <h1 className="text-5xl font-bold text-center dark:text-gray-300 text-gray-900 mb-6">
              Sign Up
            </h1>

            <form className="space-y-6" onSubmit={signup}>
              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block mb-2 text-lg dark:text-gray-300"
                >
                  Email
                </label>
                <input
                  id="email"
                  className="border p-3 shadow-md bg-white rounded-lg w-full "
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="block mb-2 text-lg dark:text-gray-300"
                >
                  Password
                </label>
                <input
                  id="password"
                  className="border p-3 shadow-md bg-white rounded-lg w-full "
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <button
                className="border p-3 shadow-md bg-gray-400 rounded-lg w-full hover:bg-gray-500"
                type="submit"
              >
                Sign Up
              </button>
            </form>

            <div className="px-8 py-4 bg-black text-center">
              <span className="text-gray-400">Already have an account? </span>
              <Link
                to="/"
                className="font-medium text-indigo-500 hover:text-indigo-400"
              >
                Login
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Sign;
