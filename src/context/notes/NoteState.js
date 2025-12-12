// src/context/notes/NoteState.js
import noteContext from "./NoteContext";
import { useState } from "react";

const NoteState = (props) => {
  // API base: set REACT_APP_API_URL in .env at project root
  const API_BASE = process.env.REACT_APP_API_URL;
  const notesInitial = [];
  const msgInitial = [];
  const emailInitial = [];
  const gmsgInitial = [];
  const userInitial = [];

  const [notes, setNotes] = useState(notesInitial);
  const [messages, setMsg] = useState(msgInitial);
  const [gmsg, setgmsg] = useState(gmsgInitial);
  const [emails, setEmails] = useState(emailInitial);
  const [user, setUser] = useState(userInitial);
  const [searchResults, setSearchResults] = useState([]);

  // helper to get token header
  function getAuthHeaders() {
    const token = localStorage.getItem("logintoken");
    const headers = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;
    return headers;
  }
  function normalizeAuthHeaders(raw) {
    if (!raw) return {};
    if (typeof raw === "string") return raw.startsWith("Bearer ") ? { Authorization: raw } : { Authorization: `Bearer ${raw}` };
    const headers = { ...raw };
    if (headers.token && !headers.Authorization) headers.Authorization = `Bearer ${headers.token}`;
    if (headers.Authorization && !headers.Authorization.startsWith("Bearer ")) {
      headers.Authorization = `Bearer ${headers.Authorization}`;
    }
    delete headers.token;
    return headers;
  }
  function buildJsonFetchOptions(bodyObj) {
    const rawAuth = getAuthHeaders();
    const auth = normalizeAuthHeaders(rawAuth || {});
    const httpHeaders = { "Content-Type": "application/json", ...auth };
    return { method: "POST", headers: httpHeaders, body: JSON.stringify(bodyObj) };
  }
  async function parseApiResponse(res) {
    const text = await res.text();
    let json;
    try {
      json = text ? JSON.parse(text) : {};
    } catch (e) {
      try {
        json = await res.json();
      } catch (e2) {
        json = {};
      }
    }
    // If API Gateway returned the Lambda-proxy wrapper, parse its body
    if (json && typeof json.body === "string") {
      try {
        const inner = JSON.parse(json.body);
        json = { ...json, ...inner };
      } catch (e) {
        // leave as-is
      }
    }
    return { ok: res.ok, body: json };
  }

  // --- fetching user information (client-side)
  // We rely on localStorage.user set at login/register time.
  const fetchuser = async () => {
    try {
      const u = localStorage.getItem("user");
      if (u) {
        // if stored as JSON string, parse; else it's a plain email string (legacy)
        try {
          const parsed = JSON.parse(u);
          setUser(parsed);
        } catch {
          // not JSON, assume it's an email string
          setUser({ email: u });
        }
        return;
      }
      // If no user in localStorage but token present, you could call auth lambda
      // to get profile — implement an operation like {operation: "getProfile"} in auth lambda.
      setUser({});
    } catch (err) {
      console.error("fetchuser error:", err);
      setUser({});
    }
  };

  // --- Fetch all Notes for logged-in user
  const fetchNote = async () => {
    try {
      const userObj = JSON.parse(localStorage.getItem("user") || "{}");
      const userEmail = userObj.email || userObj;
      if (!userEmail) {
        // nothing to fetch
        setNotes([]);
        return;
      }
      const body = { operation: "listNotes", payload: { userEmail } };
      const res = await fetch(`${API_BASE}/Notes`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(body),
      });
      const text = await res.text();
      const json = text ? JSON.parse(text) : {};
      if (!res.ok) {
        console.error("fetchNote error:", json);
        setNotes([]);
        return;
      }
      // json.Items is expected
      setNotes(json.Items || []);
    } catch (err) {
      console.error("fetchNote error:", err);
      setNotes([]);
    }
  };

  // --- Add a Note
  const addNote = async (title, tag, description) => {
    try {
      const userObj = JSON.parse(localStorage.getItem("user") || "{}");
      const userEmail = userObj.email || userObj;
      if (!userEmail) throw new Error("User not found. Please login.");

      const body = {
        operation: "createNote",
        payload: { Item: { userEmail, title, description, tag } },
      };

      const res = await fetch(`${API_BASE}/Notes`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(body),
      });
      const { ok, body: json } = await parseApiResponse(res);

    if (!ok) {
      const err = (json && (json.error || json.message)) || "Failed to create note";
      throw new Error(err);
    }
      // Lambda returns { success: true, noteId } — construct note object for UI
      const noteId = json.noteId || (json.Item && json.Item.noteId) || new Date().getTime().toString();
      const now = new Date().toISOString();
      const createdNote = {
        userEmail,
        noteId,
        title,
        description,
        tag,
        createdAt: now,
        updatedAt: now,
      };

      // update state (prepend)
      setNotes((prev) => [createdNote, ...prev]);
      return createdNote;
    } catch (err) {
      console.error("addNote error:", err);
      throw err;
    }
  };

  // --- Delete a Note
  const deleteNote = async (noteId) => {
    try {
      // If your UI previously called deleteNote(id) only, you can call fetch user to get email.
      // To keep compatibility, allow either deleteNote(id) or deleteNote(userEmail, noteId)
      const userObj = JSON.parse(localStorage.getItem("user") || "{}");
      const userEmail = userObj.email || userObj;
      if (!userEmail) throw new Error("User not found");

      const body = { operation: "deleteNote", payload: { userEmail, noteId } };
      const res = await fetch(`${API_BASE}/Notes`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(body),
      });
      const { ok, body: json } = await parseApiResponse(res);

      if (!ok) {
        const err = (json && (json.error || json.message)) || "Failed to delete note";
        throw new Error(err);
      }

      // remove from client state
      
      setNotes(prev => prev.filter(n => !(n.noteId === noteId || n._id === noteId)));
      return true;
    } catch (err) {
      console.error("deleteNote error:", err);
      throw err;
    }
  };

  // --- Edit a Note
  const editNote = async (id, title, description, tag) => {
    try {
      // noteId may be passed as first param in your current code; your previous signature was editNote(id,title,description,tag)
      // ensure we support that: accept (id,title,description,tag)
      const noteId = id ;
      const userObj = JSON.parse(localStorage.getItem("user") || "{}");
      const userEmail = userObj.email || userObj;
      if (!userEmail) throw new Error("User not found");
      

      const body = { operation: "updateNote", payload: { userEmail, noteId, updates:{ title, description, tag }, }, };
      const res = await fetch(`${API_BASE}/Notes`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(body),
      });

      const { ok, body: json } = await parseApiResponse(res);

    if (!ok) {
      const err = (json && (json.error || json.message)) || "Failed to update note";
      throw new Error(err);
    }

      // update local state copy (notes use noteId or _id depending on source)
      setNotes(prev => {
        const newNotes = JSON.parse(JSON.stringify(prev));
        for (let i = 0; i < newNotes.length; i++) {
          const n = newNotes[i];
          if (n.noteId === noteId || n._id === noteId) {
            n.title = title;
            n.description = description;
            n.tag = tag;
            n.updatedAt = new Date().toISOString();
            break;
          }
        }
        return newNotes;
      });

      return true;
    } catch (err) {
      console.error("editNote error:", err);
      throw err;
    }
  };

  // --- Send a message
  const addMsg = async (suser, ruser, description) => {
    try {
      const userObj = JSON.parse(localStorage.getItem("user") || "{}");
      const userEmail = userObj.email || userObj;
  
      // ensure caller is same as suser
      if (!userEmail) throw new Error("User not found");
      if (userEmail !== suser) {
        throw new Error("You can only send messages as the logged-in user");
      }
  
      const body = {
        operation: "createMessage",
        payload: { Item: { suser, ruser, description } },
        // include headers in the JSON body too (some backends expect this)
        // remove this if your backend expects real HTTP headers only
        headers: getAuthHeaders(),
      };
  
      // Build HTTP headers (make sure getAuthHeaders() returns an object like { Authorization: 'Bearer <token>' })
      const authHeaders = getAuthHeaders() || {};
      const httpHeaders = {
        // explicit content-type
        "Content-Type": "application/json",
        ...authHeaders,
      };
  
      const bodyStr = JSON.stringify(body);
  
      const res = await fetch(`${API_BASE}/Messages`, {
        method: "POST",
        headers: httpHeaders,
        body: bodyStr,
      });
  
      // log response status and headers
      // Note: res.headers is a Headers object; you can iterate to log values:
      for (const pair of res.headers.entries()) {

      }
  
      const { ok, body: json } = await parseApiResponse(res);
   
  
      if (!ok) {
        const err = (json && (json.error || json.message)) || "Failed to send message";
        console.error("addMsg error from API:", err);
        throw new Error(err);
      }
  
      // append to messages state (UI)
      const sent = {
        conversationId: [suser, ruser].sort().join("##"),
        sentAt: new Date().toISOString(),
        messageId: json.messageId || new Date().getTime().toString(),
        suser,
        ruser,
        description,
      };
      setMsg((prev) => [...prev, sent]);
      return sent;
    } catch (err) {
      console.error("addMsg error:", err);
      throw err;
    }
  };
  
  // --- Fetch messages sent TO this user (inbox)
  // getMessage(email) --> queries messages received by that email
  const getInbox = async (email) => {
    try {
      const bodyObj = { operation: "readReceived", payload: { ruser: email, limit: 200 } };
      const res = await fetch(`${API_BASE}/Messages`, buildJsonFetchOptions(bodyObj));
      const { ok, body: json } = await parseApiResponse(res);
      if (!ok) {
        console.error("getInbox error:", json);
        setgmsg([]); // or whatever state you use for inbox
        return [];
      }
      setgmsg(json.Items || []);
      return json.Items || [];
    } catch (err) {
      console.error("getInbox exception:", err);
      setgmsg([]);
      return [];
    }
  };
  

  // --- Fetch messages sent BY this user (sentbox)
  // Note: For real "sent messages" across all conversations you will need a GSI on suser,
  // or add a 'readSent' operation in your messages Lambda. For now this uses readReceived
  // as a placeholder to fetch the user's inbox (you can rename it later).
  const getSent = async (email) => {
    try {
      const bodyObj = { operation: "readSent", payload: { suser: email, limit: 200 } };
      const res = await fetch(`${API_BASE}/Messages`, buildJsonFetchOptions(bodyObj));
      const { ok, body: json } = await parseApiResponse(res);
      if (!ok) {
        console.error("getSent error:", json);
        setMsg([]); // or your sent message state
        return [];
      }
      setMsg(json.Items || []);
      return json.Items || [];
    } catch (err) {
      console.error("getSent exception:", err);
      setMsg([]);
      return [];
    }
  };
 // searchInboxBySender: search the logged-in user's inbox for messages from a specific sender
const searchInboxBySender = async (senderEmail, { limit = 200 } = {}) => {
  try {
    // basic validation
    if (!senderEmail || typeof senderEmail !== "string") {
      console.warn("searchInboxBySender: invalid senderEmail:", senderEmail);
      setSearchResults([]);
      return [];
    }

    const trimmed = senderEmail.trim();
    if (!trimmed) {
      setSearchResults([]);
      return [];
    }

    // Optional: simple email format check (you can remove if you want looser matching)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmed)) {
      console.warn("searchInboxBySender: senderEmail not a valid email:", trimmed);
      setSearchResults([]);
      return [];
    }

    const bodyObj = {
      operation: "searchInboxBySender",
      payload: { suser: trimmed, limit }
    };

    const fetchOptions = buildJsonFetchOptions(bodyObj);
    const res = await fetch(`${API_BASE}/Messages`, fetchOptions);

    // read raw text for better debug and safe parsing
    const raw = await res.text();
    let parsed = null;
    try { parsed = JSON.parse(raw); } catch (e) { /* not json */ }

    if (res.status !== 200 || (parsed && parsed.error)) {
      console.error("searchInboxBySender error:", parsed || raw);
      setSearchResults([]);
      return [];
    }

    const items = (parsed && parsed.Items) ? parsed.Items : [];
    setSearchResults(items);
    return items;
  } catch (err) {
    console.error("searchInboxBySender exception:", err);
    setSearchResults([]);
    return [];
  }
};


  // --- Get all registered Emails (calls auth lambda if implemented)
  // We assume your backend exposes an operation to return emails; if not, implement it.
  const fetchEmails = async () => {
    try {
      const body = { operation: "fetchEmails", payload: {} };
      const res = await fetch(`${API_BASE}/Users`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(body),
      });
  
      const text = await res.text();
  
      // try parse the outer text
      let json;
      try {
        json = text ? JSON.parse(text) : {};
      } catch (e) {
        console.warn("fetchEmails: could not parse response text as JSON", e);
        try {
          json = await res.json();
        } catch (e2) {
          console.error("fetchEmails: response.json() also failed", e2);
          setEmails([]);
          return;
        }
      }
  
      // If API Gateway returned the Lambda proxy wrapper, parse its 'body' string
      if (json && typeof json.body === "string") {
        try {
          const inner = JSON.parse(json.body);
          // prefer inner.emails but fallback to other shapes
          json = { ...json, ...inner };
        } catch (e) {
          console.warn("fetchEmails: failed to parse wrapper body:", e);
        }
      }
  
  
      // Accept a few shapes: { emails: [...] } or ["a","b"] or { Items: [...] }
      let emailArray = [];
      if (Array.isArray(json)) {
        emailArray = json;
      } else if (Array.isArray(json.emails)) {
        emailArray = json.emails;
      } else if (Array.isArray(json.Items)) {
        emailArray = json.Items;
      } else if (Array.isArray(json.emails || json.Items || [])) {
        emailArray = json.emails || json.Items || [];
      }
  
      setEmails(emailArray || []);
    } catch (err) {
      console.error("fetchEmails error:", err);
      setEmails([]);
    }
  };
  // Expose state+actions
  return (
    <noteContext.Provider
      value={{
        notes,
        user,
        messages,
        gmsg,
        emails,
        setNotes,
        addNote,
        deleteNote,
        editNote,
        fetchNote,
        addMsg,
        getSent,
        getInbox,
        fetchEmails,
        fetchuser,
        searchResults,
        searchInboxBySender
      }}
    >
      {props.children}
    </noteContext.Provider>
  );
};

export default NoteState;
