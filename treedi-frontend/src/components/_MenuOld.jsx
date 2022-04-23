import React from "react";
import "../App.css";

const MenuOld = ({ setLineColor, setLineWidth, setLineOpacity }) => {


    return (
        <div className="Menu">
            <label>Brush Color </label>
            <input
                type="color"
                onChange={(e) => {
                    setLineColor(e.target.value);
                }}
            />
            <label>Brush Width </label>
            <input
                type="range"
                min="3"
                max="20"
                onChange={(e) => {
                    setLineWidth(e.target.value);
                }}
            />
            <label>Brush Opacity</label>
            <input
                type="range"
                min="1"
                max="100"
                onChange={(e) => {
                    setLineOpacity(e.target.value / 100);
                }}
            />
            <button onClick={() => {
                const canvasSave = document.getElementById('canvas');
                const d = canvasSave.toDataURL('image/png');
                const w = window.open('about:blank', 'image from canvas');
                w.document.write("<img src='" + d + "' alt='from canvas'/>");
                console.log('Saved!');
            }}>
                Save
            </button>
            <button>
                Switch
            </button>
        </div>
    );
};

export default MenuOld;