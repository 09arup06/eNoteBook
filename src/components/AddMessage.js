import React, { useContext, useState, useEffect } from "react";
import NoteContext from "../context/notes/NoteContext";

const AddMessage = (props) => {
  const context = useContext(NoteContext);
  const { addMsg, emails, fetchEmails } = context;

  // get current user email safely from localStorage
  const currentUserEmail = (() => {
    try {
      const u = JSON.parse(localStorage.getItem("user"));
      return u?.email || "";
    } catch {
      return "";
    }
  })();

  // controlled state for the form (suser will be current user's email)
  const [msg, setMsg] = useState({
    suser: currentUserEmail,
    ruser: "",
    description: "",
  });

  useEffect(() => {
    fetchEmails();
    // eslint-disable-next-line
  }, []);

  const onChange = (e) => {
    const { name, value } = e.target;
    setMsg((prev) => ({ ...prev, [name]: value }));
  };

  const addmsg = async (e) => {
    e.preventDefault();

    if (!msg.ruser) {
      props.showAlert("Please select a recipient", "warning");
      return;
    }
    if (!msg.description || msg.description.trim().length === 0) {
      props.showAlert("Please enter a message", "warning");
      return;
    }

    // call context function (ensure it expects suser, ruser, description)
    try {
      await addMsg(msg.suser, msg.ruser, msg.description);
      props.showAlert("The message has been sent", "success");
      // clear only message and recipient, keep suser
      setMsg((prev) => ({ ...prev, ruser: "", description: "" }));
    } catch (err) {
      console.error("addMsg error:", err);
      props.showAlert("Failed to send message", "danger");
    }
  };

  return (
    <>
      <div className="container">
        <h3>Send a Message</h3>
        <form className="my-1" onSubmit={addmsg}>
          <div className="mb-3">
            <label htmlFor="ruser" className="form-label">
              Select recipient
            </label>
            <select
              className="form-select"
              id="ruser"
              name="ruser"
              value={msg.ruser}
              onChange={onChange}
            >
              <option value="">-- Select recipient --</option>
              {emails && emails.length > 0 ? (
                emails
                  .filter((email) => email !== currentUserEmail) // optional: exclude self
                  .map((email) => (
                    <option key={email} value={email}>
                      {email}
                    </option>
                  ))
              ) : (
                <option disabled>No users found</option>
              )}
            </select>
          </div>

          <div className="form-group my-2">
            <label htmlFor="suser">Your Email</label>
            <input
              type="text"
              className="form-control"
              id="suser"
              name="suser"
              disabled
              value={msg.suser}
            />
          </div>

          <div className="form-group my-2">
            <label htmlFor="description">Description</label>
            <textarea
              className="form-control"
              id="description"
              name="description"
              rows="3"
              value={msg.description}
              onChange={onChange}
              required
            ></textarea>
          </div>

          <button type="submit" className="btn btn-primary">
            Send Message
          </button>
        </form>
      </div>
    </>
  );
};

export default AddMessage;
