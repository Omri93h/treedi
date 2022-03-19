
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import Menu from "./components/Menu";
import "./App.css";
import Login from './components/OLD_Login';
import Logout from './components/OLD_Logout';
import useDrivePicker from "react-google-drive-picker";
import LoginHooks from './components/LoginHooks';
import LogoutHooks from './components/LogoutHooks';

import data_format from "./utils/DataFormat";



var Pressure = require('pressure');

function App() {
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [lineWidth, setLineWidth] = useState(5);
  const [lineColor, setLineColor] = useState("black");
  const [lineOpacity, setLineOpacity] = useState(0.1);
  const [pressureValue, setPressureValue] = useState(0);
  const [openPicker, data, authResponse] = useDrivePicker();
  let canvas = null
  // Initialization when the component
  // mounts for the first time
  useEffect(() => {

    window.moveTo(-400, 0)

    window.resizeTo(1400, 700);

    canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.canvas.style.touchAction = "none";
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.globalAlpha = lineOpacity;
    ctx.strokeStyle = lineColor;
    ctx.lineWidth = lineWidth;

    console.log(ctx.canvas)

    ctxRef.current = ctx;
  }, [lineColor, lineOpacity, lineWidth]);


  // const customViewsArray = [new google.picker.DocsView()]; // custom view
  const handleOpenPicker = () => {
    openPicker({
      clientId: process.env.CLIENT_ID,
      developerKey: process.env.DEVELOPER_KEY,
      viewId: "DOCS",
      //token:"##youraccesstoken##", // pass oauth token in case you already have one
      showUploadView: true,
      showUploadFolders: true,
      supportDrives: true,
      multiselect: true,
      // customViews: customViewsArray, // custom view
    });
  };

  const saveToDrive = () => {
    var canvas = document.querySelector('canvas');
    var dataURL = canvas.toDataURL("image/png", 1.0);
    console.log(dataURL)
    
    // Currently Downloading...
    downloadImage(dataURL, 'my-canvas.png');

    // Trial
    data_format.Images.push(dataURL)
    console.log(data_format)

  }

  function downloadImage(data, filename = 'untitled.png') {
    var a = document.createElement('a');
    a.href = data;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
  }


  Pressure.set('canvas', {
    change: function (force, event) {
      // console.log(force);
      setPressureValue(force)
    }
  });

  // Function for starting the drawing
  const startDrawing = (e) => {
    ctxRef.current.beginPath();
    ctxRef.current.moveTo(
      e.nativeEvent.offsetX,
      e.nativeEvent.offsetY
    );
    setIsDrawing(true);
  };

  // Function for ending the drawing
  const endDrawing = () => {
    ctxRef.current.closePath();
    setIsDrawing(false);
  };

  const draw = (e) => {
    if (!isDrawing) {
      return;
    }
    if (e.type === 'touchmove') {
      ctxRef.current.lineTo(
        e.nativeEvent.changedTouches[0].clientX,
        e.nativeEvent.changedTouches[0].clientY
        // e.nativeEvent.changedTouches[0].screenX,
        // e.nativeEvent.changedTouches[0].screenY
      )
    }
    else {
      ctxRef.current.lineTo(
        e.nativeEvent.offsetX,
        e.nativeEvent.offsetY
      )
    }
    ctxRef.current.stroke();
  };

  const pressureElement = (<div id="pressure-element"> {pressureValue} </div>)



  return (
    <div className="App">
      <div className="draw-area">
        <canvas id="canvas"
          onTouchStart={startDrawing}
          onTouchEnd={endDrawing}
          onTouchMove={draw}
          onMouseDown={startDrawing}
          onMouseUp={endDrawing}
          onMouseMove={draw}
          ref={canvasRef}
          width={window.screen.width}
          height={window.screen.height}
        />

      </div>
      {pressureElement}
      <Menu
        setLineColor={setLineColor}
        setLineWidth={setLineWidth}
        setLineOpacity={setLineOpacity}
      />


      {/* trial for saving image */}
      <a id="link"></a>

      <button onClick={() => handleOpenPicker()}>Open Picker</button>
      <button onClick={() => saveToDrive()}>saveToDrive</button>
      {/* {console.log(isLoggedIn)} */}
      {/* <Logout setLoggedIn={setLoggedIn} /> */}
      {/* <Login setLoggedIn={setLoggedIn} /> */}
      <h2>The Components way</h2>
      <Login />
      <Logout />
      <h2>The Hooks way</h2>
      <LoginHooks />
      <LogoutHooks />
    </div>

  );
}

export default App;
