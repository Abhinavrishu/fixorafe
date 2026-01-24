import { useState, useRef } from "react";
import Message from "./message.jsx";

export default function Chat() {

  const [messages, setMessages] = useState([
    { from: "ai", text: "Upload code, logs, or images for cybersecurity analysis." }
  ]);

  const [input, setInput] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const fileInputRef = useRef(null);
  const imageInputRef = useRef(null);

  async function handleSend() {

    if (!input.trim() && !file) return;

    const userMsg = {
      from: "user",
      text: input || "📎 File uploaded",
      fileName: file?.name
    };

    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {

      let res;

      // CASE 1 → FILE
      if (file) {

        const form = new FormData();
        form.append("file", file);

        res = await fetch("http://localhost:3000/ask", {
          method: "POST",
        
          body: form
        });
      }

      // CASE 2 → TEXT
      else {

        res = await fetch("http://localhost:3000/ask", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: input })
        });
      }

      const data = await res.json();

      setMessages(prev => [
        ...prev,
        { from: "ai", text: data.answer }
      ]);

    } catch (err) {

      setMessages(prev => [
        ...prev,
        { from: "ai", text: "❌ Server error. Try again." }
      ]);

    } finally {

      setLoading(false);
      setFile(null);
    }
  }

  function handleFileChange(e) {
    setFile(e.target.files[0]);
  }

  function handleDrop(e) {
    e.preventDefault();
    setFile(e.dataTransfer.files[0]);
  }

  function handleDragOver(e) {
    e.preventDefault();
  }

  return (
    <div className="chat-container">

      <div className="messages">
        {messages.map((msg, i) => (
          <Message key={i} {...msg} />
        ))}

        {loading && (
          <Message from="ai" text="🔍 Analyzing security..." />
        )}
      </div>

      {/* INPUT AREA */}
      <div
        className="input-bar drop-zone"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <input
          placeholder="Paste code or describe issue..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={loading}
        />

        <button onClick={() => fileInputRef.current.click()}>📄</button>
        <button onClick={() => imageInputRef.current.click()}>🖼</button>
        <button onClick={handleSend} disabled={loading}>
          {loading ? "..." : "SEND"}
        </button>

        {/* Hidden inputs */}
        <input
          type="file"
          ref={fileInputRef}
          hidden
          onChange={handleFileChange}
        />

        <input
          type="file"
          ref={imageInputRef}
          accept="image/*"
          hidden
          onChange={handleFileChange}
        />
      </div>

      {/* FILE PREVIEW */}
      {file && (
        <div className="file-preview">
          📎 {file.name}
        </div>
      )}
    </div>
  );
}
