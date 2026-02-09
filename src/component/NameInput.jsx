import React from "react";

function NameInput({ value, onChange, label = "Name" }) {
  return (
    <div>
      <label className="block mb-2 text-lg text-gray-300">{label}</label>
      <input
        type="text"
        placeholder="Enter name"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="border p-3 shadow-md bg-white rounded-lg w-full"
        required
      />
    </div>
  );
}

export default NameInput;
