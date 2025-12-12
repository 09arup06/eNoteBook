// Messages.js
import React, { useContext, useEffect, useState } from "react";
import MessageItem from "./MessageItem";
import { useNavigate } from "react-router-dom";
import NoteContext from "../context/notes/NoteContext";
import AddMessage from "./AddMessage";

const Messages = (props) => {
  const context = useContext(NoteContext);
  const { messages, gmsg, getInbox, getSent, searchInboxBySender } = context;

  const [searchResults, setSearchResults] = useState([]);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("logintoken");
    if (token) {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const email = user.email;
      if (email) {
        getInbox(email);
        getSent(email);
      } else {
        console.warn("No user email in localStorage.user");
        navigate("/login");
      }
    } else {
      navigate("/login");
    }
    // eslint-disable-next-line
  }, []);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const onSearch = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    const trimmed = (query || "").trim();

    if (!trimmed) {
      setSearchResults([]);
      props.showAlert("Enter a user email to search", "warning");
      return;
    }

    if (!emailRegex.test(trimmed)) {
      setSearchResults([]);
      props.showAlert("This is not a valid email address", "danger");
      return;
    }

    try {
      const results = await searchInboxBySender(trimmed);
      // ensure we set local state (context function may or may not set its own state)
      setSearchResults(results || []);
      if (!results || results.length === 0) {
        props.showAlert("You haven't received any message from this user", "info");
      }
    } catch (err) {
      console.error("search error:", err);
      props.showAlert("Error while searching, try again", "danger");
      setSearchResults([]);
    }
  };

  return (
    <>
      <AddMessage showAlert={props.showAlert} />

      <div className="row my-3 container">
        <h2>Sent Messages</h2>

        {/* Search bar */}
        <form onSubmit={onSearch} style={{ marginBottom: "1rem", display: "flex", gap: 8, alignItems: "center", maxWidth: 520 }}>
          <input
            aria-label="Search sender email"
            type="text"
            placeholder="Enter Sender's Email "
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{
              flex: 1,
              padding: "10px 14px",
              borderRadius: "8px",
              border: "1px solid #ccc",
              fontSize: "0.95rem",
              transition: "border-color .15s",
            }}
            onFocus={(e) => (e.target.style.borderColor = "#6c63ff")}
            onBlur={(e) => (e.target.style.borderColor = "#ccc")}
          />
          <button
            type="submit"
            style={{
              padding: "10px 16px",
              borderRadius: "8px",
              backgroundColor: "#6c63ff",
              color: "white",
              border: "none",
              cursor: "pointer",
              fontWeight: "600",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#5750e5")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#6c63ff")}
          >
            Search
          </button>
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setSearchResults([]);
            }}
            style={{
              padding: "10px 12px",
              borderRadius: "8px",
              backgroundColor: "#f0f0f0",
              border: "1px solid #ddd",
              cursor: "pointer",
            }}
          >
            Clear
          </button>
        </form>

        {/* Search results */}
        {Array.isArray(searchResults) && searchResults.length > 0 && (
          <div style={{ marginBottom: 16 }}>
            <h4 style={{ color: "#6c63ff", marginBottom: 8 }}>
              Messages you received from <strong>{query}</strong>
            </h4>

            {searchResults.map((msg) => (
              <div
                key={msg.messageId}
                style={{
                  padding: "12px 16px",
                  border: "1px solid #e0e0e0",
                  borderRadius: "8px",
                  marginBottom: "10px",
                  backgroundColor: "#fafafa",
                }}
              >
                <p style={{ marginBottom: "6px" }}>{msg.description}</p>
                <small style={{ color: "#555" }}>{msg.sentAt}</small>
              </div>
            ))}
          </div>
        )}

        <div className="container" style={{ marginTop: 12 }}>
          {messages.length < 1 && "You haven't sent any messages"}
        </div>
        {messages.map((msg) => (
          <MessageItem key={msg.messageId} msg={msg} showAlert={props.showAlert} />
        ))}
      </div>

      <div className="row my-3 container">
        <h2>Inbox</h2>
        <div className="container">{gmsg.length < 1 && "You have no messages"}</div>
        {gmsg.map((msg) => (
          <MessageItem key={msg.messageId} msg={msg} showAlert={props.showAlert} />
        ))}
      </div>
    </>
  );
};

export default Messages;
