import React, { useState, useRef } from "react";
import { Auth } from "../../components/Auth/Auth";
import Cookies from "universal-cookie";
import { Chat } from "../../components/Chat/Chat";
import { signOut } from "firebase/auth";
import { auth } from "../../services/firebaseConfig";
import "./Home.css";
const cookies = new Cookies();

export const Home = () => {
  const [isAuth, setIsAuth] = useState(cookies.get("auth-token"));
  const [room, setRoom] = useState(cookies.get("room-name"));

  const roomInputRef = useRef(null);

  if (!isAuth) {
    return <Auth setIsAuth={setIsAuth} />;
  }

  const signUserOut = async () => {
    await signOut(auth);
    cookies.remove("auth-token");
    setIsAuth(false);
    setRoom(null);
  };

  return (
    <div className="home">
      {room && auth ? (
        <Chat room={room} />
      ) : (
        <div className="room">
          <label htmlFor="">Enter Room Name</label>
          <div className="InputContainer">
            <input ref={roomInputRef} className="room-input" />
          </div>
          <button
            className="button"
            onClick={() => {
              setRoom(roomInputRef.current.value);
              cookies.set("room-name", roomInputRef.current.value);
            }}
          >
            <p className="text">Enter Chat</p>
          </button>
        </div>
      )}
      <div className="sign-out">
        {room ? (
          <button
            onClick={() => {
              setRoom(null);
            }}
            className="button"
          >
            <p className="text">Leave Room</p>
          </button>
        ) : null}
        <button onClick={signUserOut} className="sign-out-button button">
          <p className="text">Sign Out</p>
        </button>
      </div>
    </div>
  );
};
