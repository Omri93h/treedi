import React from 'react'

const ScreenToWriteTo = ({setDisplayScreenToWriteTo, screenToWriteTo}) => {
  return (
    <div
    onAnimationEnd={() => setDisplayScreenToWriteTo(false)}
    style={{
        position: "absolute",
        margin: "1%",
        height: String(window.screen.height / 2) + "px",
        lineHeight: String(window.screen.height / 2) + "px",
        width: String(window.screen.width) + "px",
        animation: "fadeOut 1s forwards",
        animationDelay: "0.2s",
        color: "black",
        textAlign: "center",
        fontSize: "100px",
        zIndex: "99",
        opacity: "0.2",
        background: "lightblue",
        border: "1px solid green",
    }}>
    {screenToWriteTo > 0 ? "Writing To Screen " + Number(screenToWriteTo) : "Pressure Mode"}
</div>
  )
}

export default ScreenToWriteTo