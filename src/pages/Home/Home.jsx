import React, { useState, useRef, useEffect } from "react";
import { Auth } from "../../components/Auth/Auth";
import Cookies from "universal-cookie";
import { Chat } from "../../components/Chat/Chat";
import { signOut } from "firebase/auth";
import { auth } from "../../services/firebaseConfig";
import "./Home.css";
const cookies = new Cookies();
import { HexColorPicker } from "powerful-color-picker";

export const Home = () => {
  const [isAuth, setIsAuth] = useState(cookies.get("auth-token"));
  const [room, setRoom] = useState(cookies.get("room-name"));
  const [color, setColor] = useState(cookies.get("prefer-color") || "#116cf5");

  const roomInputRef = useRef(null);

  useEffect(() => {
    document.documentElement.style.setProperty("--primary-color", color);
    cookies.set("prefer-color", color);
  }, [color]);

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
          <label htmlFor="">Entrar em um chat</label>
          <div className="InputContainer">
            <input
              ref={roomInputRef}
              className="room-input"
              style={{ "text-transform": "uppercase" }}
            />
          </div>
          <button
            className="button-effect button"
            onClick={() => {
              setRoom(roomInputRef.current.value.toUpperCase());
              cookies.set(
                "room-name",
                roomInputRef.current.value.toUpperCase()
              );
            }}
          >
            <p className="text">Entrar no Chat</p>
          </button>
        </div>
      )}
      <div className="menu">
        {room ? (
          <button
            onClick={() => {
              setRoom(null);
            }}
            className="button-effect button"
          >
            <p className="text">Sair do Chat</p>
          </button>
        ) : null}
        <button onClick={signUserOut} className="sign-out-button button button-effect">
          <p className="text">Sair da Conta</p>
        </button>
        <HexColorPicker color={color} onChange={setColor} />
      </div>
    </div>
  );
};
