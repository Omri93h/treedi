
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import Menu from "./components/Menu";
import "./App.css";
import Login from './components/OLD_Login';
import Logout from './components/OLD_Logout';
import useDrivePicker from "react-google-drive-picker";
import LoginHooks from './components/LoginHooks';
import LogoutHooks from './components/LogoutHooks';

var Pressure = require('pressure');

function App2() {
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [lineWidth, setLineWidth] = useState(5);
  const [lineColor, setLineColor] = useState("black");
  const [lineOpacity, setLineOpacity] = useState(0.1);
  const [pressureValue, setPressureValue] = useState(0);
  const [openPicker, data, authResponse] = useDrivePicker();

  // Initialization when the component
  // mounts for the first time
  useEffect(() => {

    window.moveTo(-400,0)
    
    window.resizeTo(1400,700);

    const canvas = canvasRef.current;
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
      clientId: "570116819468-tl8q8ndkk59a7i25rp874liu56fcua21.apps.googleusercontent.com",
      developerKey: "AIzaSyAoi2XwXhBeXr_4Q8KJivraKTe3b9G7f_k",
      viewId: "DOCS",
      //token:"##youraccesstoken##", // pass oauth token in case you already have one
      showUploadView: true,
      showUploadFolders: true,
      supportDrives: true,
      multiselect: true,
      // customViews: customViewsArray, // custom view
    });
  };

  // useEffect(() => {
  //   // do anything with the selected/uploaded files
  //   if (data) {
  //     console.log(data);
  //     data.docs.map((i) => console.log(i));
  //   }
  // }, [data]);


  // end jonny

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
      <button onClick={() => handleOpenPicker()}>Open Picker</button>
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

export default App2;
