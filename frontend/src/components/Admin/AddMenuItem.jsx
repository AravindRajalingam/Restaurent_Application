import { useEffect, useState, useRef } from "react";

export default function AddMenuItem() {
  const API_URL = import.meta.env.VITE_API_URL;

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [image, setImage] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  // 🔹 TAG STATES
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState([]);

  const fileInputRef = useRef(null);

  // 🔹 Fetch categories
  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch(`${API_URL}/menu/get-categories`);
        const data = await res.json();

        if (data.success) {
          setCategories(data.data);
        } else {
          alert("Failed to load categories");
        }
      } catch (err) {
        console.error(err);
      }
    }

    fetchCategories();
  }, []);

  // 🔹 ADD TAG
  const addTag = () => {
    const tag = tagInput.trim().toLowerCase();
    if (!tag || tags.includes(tag)) return;

    setTags([...tags, tag]);
    setTagInput("");
  };

  // 🔹 REMOVE TAG
  const removeTag = (tag) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !price || !image || !categoryId) {
      alert("All fields are required");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("category_id", categoryId);
    formData.append("image", image);

    // 🔹 SEND TAGS
    formData.append("tags", JSON.stringify(tags));

    try {
      setLoading(true);

      const res = await fetch(`${API_URL}/menu/add-menu-item`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Failed to add item");
        return;
      }

      alert("Menu item added successfully ✅");

      // reset
      setName("");
      setDescription("");
      setPrice("");
      setCategoryId("");
      setImage(null);
      setTags([]);
      setTagInput("");

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

    } catch (err) {
      console.error(err);
      alert("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-16 bg-white p-6 rounded-xl shadow-lg">
      <h2 className="text-xl font-bold mb-4 text-center">
        Add Menu Item
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">

        <input
          type="text"
          placeholder="Item Name"
          className="input input-bordered w-full"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <textarea
          placeholder="Description"
          className="textarea textarea-bordered w-full"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <input
          type="number"
          placeholder="Price"
          className="input input-bordered w-full"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />

        <select
          className="select select-bordered w-full"
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
        >
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>

        {/* 🔹 TAG INPUT */}
        <div className="space-y-2">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Add tag (e.g. spicy)"
              className="input input-bordered w-full"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
            />
            <button
              type="button"
              className="btn btn-outline"
              onClick={addTag}
            >
              Add
            </button>
          </div>

          {/* TAG LIST */}
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="badge badge-primary gap-2"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                >
                  ✕
                </button>
              </span>
            ))}
          </div>
        </div>

        <input
          type="file"
          accept="image/*"
          className="file-input file-input-bordered w-full"
          onChange={(e) => setImage(e.target.files[0])}
          ref={fileInputRef}
        />

        <button
          type="submit"
          className="btn btn-primary w-full"
          disabled={loading}
        >
          {loading ? "Uploading..." : "Add Item"}
        </button>
      </form>
    </div>
  );
}
