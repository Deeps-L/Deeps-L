import React, { useEffect, useRef, useState } from "react";
import Phaser from "phaser";
import "./App.css";
import io from "socket.io-client";

const App = () => {
  const phaserRef = useRef(null);
  let ball;

  // const [role, setRole] = useState(""); 
  const socket = io("http://localhost:3001");
  function handleClick(targetX, targetY, speed) {
    // Calculate the direction towards the clicked button

    
    const velocityX = targetX - ball.x;
    const velocityY = targetY - ball.y;
     ball.speed = 500;
    // Set the velocities
    ball.setVelocity(velocityX * speed, velocityY * speed);

    socket.emit("adminButtonClicked", { targetX, targetY });
  }

  useEffect(() => {

   
    socket.on("connect", () => {
      console.log("Connected to server");
    });

    // socket.on("roleAssigned", (userRole) => {
    //   setRole(userRole);
    // });


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

    const game = new Phaser.Game(config);

    function preload() {
      this.load.image("Tennis", "./assets/tennisBall.jpg");
    }

    function create() {
      ball = this.physics.add.image(400, 300, "Tennis");
      ball.setCollideWorldBounds(true);
      ball.setBounce(1);
      ball.setVelocity(250, 250);
    }

    function update() {
      // Update logic here
    }

    return () => {
      game.destroy(true);
      socket.disconnect();
    };
  }, []);

  return (
    <div className="container">
      <h1>Hello User!</h1>
      <div className="canvas-container" ref={phaserRef}></div>
      <div className="btnGroup">
        <button
          id="btn1"
          onClick={() => handleClick(200, 0, 1)}
          className="button"
        >
          Button 1
        </button>
        <button
          id="btn2"
          onClick={() => handleClick(500, 0, 1.5)}
          className="button"
        >
          Button 2
        </button>
        <button
          id="btn3"
          onClick={() => handleClick(800, 160, 1.5)}
          className="button"
        >
          Button 3
        </button>
        <button
          id="btn4"
          onClick={() => handleClick(800, 450, 1)}
          className="button"
        >
          Button 4
        </button>

        <button
          id="btn5"
          onClick={() => handleClick(200, 600, 1)}
          className="button"
        >
          Button 5
        </button>
        <button
          id="btn6"
          onClick={() => handleClick(500, 600, 1)}
          className="button"
        >
          Button 6
        </button>

        <button
          id="btn7"
          onClick={() => handleClick(0, 200, 1)}
          className="button"
        >
          Button 7
        </button>
        <button
          id="btn8"
          onClick={() => handleClick(0, 400, 1)}
          className="button"
        >
          Button 8
        </button>
      </div>
    </div>
  );
};

export default App;
