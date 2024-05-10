import React, { useEffect, useRef, useState } from "react";
import Phaser from "phaser";
import "./App.css";
import io from "socket.io-client";

const App = () => {
  const phaserRef = useRef(null);
  const ball = useRef(null);
  const game = useRef(null);
  const socket = useRef(null);

  const [isAdmin, setIsAdmin] = useState(false);
  const [clickedButtons, setClickedButtons] = useState([]);

  useEffect(() => {
    socket.current = io("http://localhost:3001");

    socket.current.on("connect", () => {
      console.log("Connected to server");
    });
    socket.current.on("admin", () => {
      console.log("Received admin button number");
      setIsAdmin(true);
    });
    socket.current.on("user", () => {
      console.log("Received user number");
      setIsAdmin(false);
    });

    const config = {
      type: Phaser.AUTO,
      width: 800,
      height: 600,
      backgroundColor: "#c82525",
      scene: {
        preload: preload,
        create: create,
        update: update,
      },
      physics: {
        default: "arcade",
        arcade: {
          gravity: { y: 0 },
          debug: false,
        },
      },
    };

    game.current = new Phaser.Game(config);

    function preload() {
      this.load.image("Tennis", "./assets/tennisBall.jpg");
    }

    function create() {
      socket.current.emit(isAdmin ? "admin" : "user");
      ball.current = this.physics.add.sprite(400, 300, "Tennis");
      ball.current.setCollideWorldBounds(true);
      ball.current.setBounce(1);
      ball.current.setVelocity(250, 250);
      this.physics.world.setBoundsCollision(true, true, true, true);

      socket.current.on("ballMoved", (data) => {
        ball.current.setVelocity(data.velocityX, data.velocityY);
      });
    }

    function update() {
      // Move logic here if needed
    }

    return () => {
      game.current.destroy(true);
      socket.current.disconnect();
    };
  }, []);

  useEffect(() => {
  socket.current.on("userButtonClicked", ({ x, y, buttonName }) => {
    if (isAdmin) {
      // Emit the button click data to all users, including the admin
      socket.current.emit("adminButtonClicked", buttonName);
    }
    setClickedButtons([...clickedButtons, buttonName]);
  });
}, [isAdmin, clickedButtons]);


  const handleClick = (targetX, targetY, speed, buttonName) => {
    const velocityX = targetX - ball.current.x;
    const velocityY = targetY - ball.current.y;
  
    ball.current.setVelocity(velocityX * speed, velocityY * speed);
  
    if (!isAdmin) {
      // Emit the button click data to the server
      socket.current.emit("userButtonClicked", { x: targetX, y: targetY, buttonName });
    }
  
    setClickedButtons([...clickedButtons, buttonName]);
  };
  

  return (
    <div className="container">
      <div id="right-panel">
        <h2 className="text-lg font-extrabold">
          {isAdmin ? (
            <div style={{ textAlign: 'center', marginBottom: '10px' }}>
              <p className="text-center justify-center items-center">ADMIN</p>
              
            </div>
          ) : (
            <div className="flex" style={{ textAlign: 'center', marginBottom: '10px' }}>
              <p className="text-lg ml-96 font-extrabold">USER</p>
              {clickedButtons.length > 0 && (
                <h6><i>
                  <p className="ml-96 text-lg font-extrabold">
                    Buttons clicked by admin: {clickedButtons.join(", ")}
                  </p>
                </i></h6>
              )}
            </div>
          )}
        </h2>
      </div>
      <div className="canvas-container" ref={phaserRef}></div>
      <div className="btnGroup">
        <button
          id="btn1"
          onClick={() => handleClick(200, 0, 1, "Button 1")}
          className="button"
        >
          Button 1
        </button>
        <button
          id="btn2"
          onClick={() => handleClick(500, 0, 1.5, "Button 2")}
          className="button"
        >
          Button 2
        </button>
        <button
          id="btn3"
          onClick={() => handleClick(800, 160, 1.5, "Button 3")}
          className="button"
        >
          Button 3
        </button>
        <button
          id="btn4"
          onClick={() => handleClick(800, 450, 1, "Button 4")}
          className="button"
        >
          Button 4
        </button>

        <button
          id="btn5"
          onClick={() => handleClick(200, 600, 1, "Button 5")}
          className="button"
        >
          Button 5
        </button>
        <button
          id="btn6"
          onClick={() => handleClick(500, 600, 1, "Button 6")}
          className="button"
        >
          Button 6
        </button>

        <button
          id="btn7"
          onClick={() => handleClick(0, 200, 1, "Button 7")}
          className="button"
        >
          Button 7
        </button>
        <button
          id="btn8"
          onClick={() => handleClick(0, 400, 1, "Button 8")}
          className="button"
        >
          Button 8
        </button>
      </div>
    </div>
  );
};

export default App;
