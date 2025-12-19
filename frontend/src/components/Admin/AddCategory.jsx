import { useState } from "react";

export default function AddCategory() {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL;

  const submitCategory = async () => {
    if (!name.trim()) {
      alert("Category name is required");
      return;
    }

    try {
      setLoading(true);

      const access_token = localStorage.getItem("access_token");

      const res = await fetch(`${API_URL}/menu/add-category`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        //   Authorization: `Bearer ${access_token}`,
        },
        body: JSON.stringify({ name }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to add category");
      }

      alert("Category added successfully");
      setName(""); // clear input

    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="my-20 flex gap-4 justify-center">
      <input
        type="text"
        className="input input-bordered"
        placeholder="Category Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <button
        onClick={submitCategory}
        disabled={loading}
        className="btn btn-primary"
      >
        {loading ? "Adding..." : "Add"}
      </button>
    </div>
  );
}
