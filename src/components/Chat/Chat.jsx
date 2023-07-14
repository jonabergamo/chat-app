import React, { useEffect, useState } from "react";
import {
  addDoc,
  collection,
  serverTimestamp,
  onSnapshot,
  query,
  where,
  orderBy,
} from "firebase/firestore";
import { app, auth } from "../../services/firebaseConfig";
import { getFirestore } from "firebase/firestore";
import "./Chat.css";

export const Chat = (props) => {
  const db = getFirestore(app);
  const { room } = props;
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const chat = document.querySelector("#messages");

  const messagesRef = collection(db, "messages");

  useEffect(() => {
    const queryMessages = query(
      messagesRef,
      where("room", "==", room),
      orderBy("createdAt")
    );
    const unsuscribe = onSnapshot(queryMessages, (snapshot) => {
      let messages = [];
      snapshot.forEach((doc) => {
        messages.push({ ...doc.data(), id: doc.id });
      });
      setMessages(messages);
    });

    return () => unsuscribe();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newMessage === "") return;

    await addDoc(messagesRef, {
      text: newMessage,
      createdAt: serverTimestamp(),
      user: auth.currentUser.displayName,
      room,
      userID: auth.currentUser.uid,
      userPhoto: auth.currentUser.photoURL,
    });

    setNewMessage("");

    chat.scrollTo(0, chat.scrollHeight);
  };

  return (
    <div className="chat-app">
      <div className="header">
        <h1>{room.toUpperCase()}</h1>
      </div>
      <div className="messages" id="messages">
        {messages.map((message) => {
          return (
            <div
              className={
                message.userID === auth.currentUser.uid
                  ? "my message"
                  : "other message"
              }
              key={message.id}
            >
              {message.userID !== auth.currentUser.uid ? (
                <img src={message.userPhoto} className="picture" />
              ) : null}
              <div className="information">
                <span className="user">{message.user} </span>
                <span>{message.text}</span>
              </div>
            </div>
          );
        })}
      </div>
      <form className="new-message-form" onSubmit={handleSubmit}>
        <input
          className="new-message-input"
          placeholder="Type your message here"
          onChange={(e) => {
            setNewMessage(e.target.value);
          }}
          value={newMessage}
        />
        <button className="send-button" type="submit">
          Send
        </button>
      </form>
    </div>
  );
};
