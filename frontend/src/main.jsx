// ✅ MUST be first line — before any Cesium import
window.CESIUM_BASE_URL = "/cesium"

import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App"
import "./index.css"
import "cesium/Build/Cesium/Widgets/widgets.css"

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
