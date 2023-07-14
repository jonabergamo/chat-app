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
import { app, auth, storage } from "../../services/firebaseConfig";
import { getFirestore } from "firebase/firestore";
import "./Chat.css";
import audio from "../../assets/notification.mp3";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { RiImageAddFill } from "react-icons/ri";

export const Chat = (props) => {
  const db = getFirestore(app);
  const { room } = props;
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [fileUpload, setfileUpload] = useState(null);
  const chat = document.querySelector("#messages");
  const [filePreview, setfilePreview] = useState(null);

  const messagesRef = collection(db, "messages");

  var notification = new Audio(audio);

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

  useEffect(() => {
    const lastMessage = messages[messages.length - 1];

    if (lastMessage?.userID !== auth?.currentUser?.uid) {
      //notification.play();
    }
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newMessage === "" && fileUpload === null) return;

    const filesFolderRef = fileUpload
      ? ref(storage, `projectFiles/${fileUpload.name}`)
      : null;

    try {
      const uploadedFile = await uploadPhoto();

      await addDoc(messagesRef, {
        text: newMessage,
        createdAt: serverTimestamp(),
        user: auth.currentUser.displayName,
        room,
        userID: auth.currentUser.uid,
        userPhoto: auth.currentUser.photoURL,
        imageURL: uploadedFile ? uploadedFile : false,
      });
    } catch (err) {
      console.error(err);
    }

    setNewMessage("");
    setfileUpload(null);

    chat.scrollTo(0, chat.scrollHeight);

    async function uploadPhoto() {
      if (!filesFolderRef) return;
      await uploadBytes(filesFolderRef, fileUpload);
      const uploadedFile = await getDownloadURL(filesFolderRef);
      return uploadedFile;
    }
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
                {message.imageURL ? (
                  <img src={message.imageURL} className="sended-photo" />
                ) : null}
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

        <label class="custom-file-upload button-effect">
          <input
            type="file"
            value={!fileUpload ? "" : null}
            onChange={(e) => {
              setfileUpload(e.target.files[0]);
            }}
          />
          <RiImageAddFill size={25} color="white" />
        </label>
        <button className="send-button button-effect" type="submit">
          Enviar
        </button>
      </form>
      {fileUpload ? (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <img
            src={URL.createObjectURL(fileUpload)}
            className="image-preview"
            onClick={() => {
              setfileUpload(null);
            }}
          />
          <figcaption style={{ color: "gray" }}>
            Clique na imagem para cancelar
          </figcaption>
        </div>
      ) : null}
    </div>
  );
};
