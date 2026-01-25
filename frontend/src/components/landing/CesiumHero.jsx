


"use client"

import { useEffect, useRef } from "react"
import "cesium/Build/Cesium/Widgets/widgets.css"

export default function CesiumHero() {
  const containerRef = useRef(null)
  const viewerRef = useRef(null)
  const rotateEventRef = useRef(null)

  const eventPins = [
  // 🇮🇳 INDIA (Core focus)
  {
    id: 1,
    name: "HackDelhi 2024",
    type: "hackathon",
    lat: 28.6139,
    lon: 77.209,
    color: [0, 255, 255], // Cyan
  },
  {
    id: 2,
    name: "Bangalore AI Workshop",
    type: "workshop",
    lat: 12.9716,
    lon: 77.5946,
    color: [255, 165, 0], // Orange
  },

  // 🇺🇸 USA
  {
    id: 3,
    name: "Silicon Valley Hack Week",
    type: "hackathon",
    lat: 37.3875,
    lon: -122.0575,
    color: [0, 255, 255],
  },

  // 🇩🇪 GERMANY
  {
    id: 4,
    name: "Berlin Tech Meetup",
    type: "event",
    lat: 52.52,
    lon: 13.405,
    color: [0, 255, 100], // Green
  },

  // 🇯🇵 JAPAN
  {
    id: 5,
    name: "Tokyo Developer Summit",
    type: "event",
    lat: 35.6762,
    lon: 139.6503,
    color: [0, 255, 100],
  },

  // 🇦🇺 AUSTRALIA
  {
    id: 6,
    name: "Sydney Cloud Workshop",
    type: "workshop",
    lat: -33.8688,
    lon: 151.2093,
    color: [255, 165, 0],
  },
]


  useEffect(() => {
    const initCesium = async () => {
      if (!containerRef.current) return
      if (viewerRef.current) return

      try {
        // MUST be set before Viewer
        window.CESIUM_BASE_URL = "/cesium"

        const Cesium = await import("cesium")

        Cesium.Ion.defaultAccessToken = import.meta.env.VITE_CESIUM_TOKEN || "YOUR_TOKEN_HERE"

        const viewer = new Cesium.Viewer(containerRef.current, {
          animation: false,
          timeline: false,
          baseLayerPicker: false,
          geocoder: false,
          homeButton: false,
          sceneModePicker: false,
          navigationHelpButton: false,
          infoBox: false,
          fullscreenButton: false,
          selectionIndicator: false,

          // ✅ DO NOT override imageryProvider
          // Cesium Ion World Imagery is loaded automatically

          terrain: Cesium.Terrain.fromWorldTerrain(),
        })

        viewerRef.current = viewer

        /* ---------- GLOBE ---------- */
        const globe = viewer.scene.globe
        globe.show = true
        globe.enableLighting = true
        globe.baseColor = Cesium.Color.BLACK

        /* ---------- SKY & SPACE ---------- */
        viewer.scene.skyBox.show = true
        viewer.scene.skyAtmosphere.show = true
        viewer.scene.backgroundColor = Cesium.Color.BLACK

        /* ---------- LIGHTING ---------- */
        viewer.scene.light = new Cesium.SunLight()

        /* ---------- POST FX ---------- */
        viewer.scene.postProcessStages.fxaa.enabled = true

        const bloom = viewer.scene.postProcessStages.bloom
        bloom.enabled = true
        bloom.uniforms.glowOnly = false
        bloom.uniforms.contrast = 128
        bloom.uniforms.brightness = -0.3
        bloom.uniforms.sigma = 2.5


        viewer.camera.setView({
  destination: Cesium.Cartesian3.fromDegrees(20, 15, 35_000_000), // FAR
  orientation: {
    heading: 0,
    pitch: Cesium.Math.toRadians(-90),
    roll: 0,
  },
})

viewer.camera.flyTo({
  destination: Cesium.Cartesian3.fromDegrees(20, 15, 18_000_000), // FINAL
  duration: 3.2, // seconds (sweet spot)
  easingFunction: Cesium.EasingFunction.QUADRATIC_IN_OUT,
})


        /* ---------- SMOOTH ROTATION WITH PAUSE ON TAB HIDDEN ---------- */
        const rotateFn = () => {
          viewer.camera.rotate(Cesium.Cartesian3.UNIT_Z, 0.00055)
        }

        viewer.scene.preRender.addEventListener(rotateFn)
        rotateEventRef.current = rotateFn

        const onVisibilityChange = () => {
          if (document.hidden) {
            viewer.scene.preRender.removeEventListener(rotateFn)
            console.log("[v0] Rotation paused - tab hidden")
          } else {
            viewer.scene.preRender.addEventListener(rotateFn)
            console.log("[v0] Rotation resumed - tab visible")
          }
        }

        document.addEventListener("visibilitychange", onVisibilityChange)

        /* ---------- ADD MOCK EVENT PINS ---------- */
        eventPins.forEach((event) => {
          const position = Cesium.Cartesian3.fromDegrees(event.lon, event.lat, 100_000)

          const [r, g, b] = event.color
          const color = new Cesium.Color(r / 255, g / 255, b / 255, 0.9)

          viewer.entities.add({
            position: position,
            point: {
              pixelSize: 12,
              color: color,
              outlineColor: Cesium.Color.WHITE,
              outlineWidth: 2,
              heightReference: Cesium.HeightReference.NONE,
            },
            label: {
              text: event.name,
              font: "12px sans-serif",
              fillColor: Cesium.Color.WHITE,
              outlineColor: Cesium.Color.BLACK,
              outlineWidth: 2,
              style: Cesium.LabelStyle.FILL_AND_OUTLINE,
              pixelOffset: new Cesium.Cartesian2(0, 20),
              showBackground: true,
              backgroundColor: new Cesium.Color(0, 0, 0, 0.7),
              backgroundPadding: new Cesium.Cartesian2(5, 5),
            },
          })
        })

        /* ---------- DISABLE INPUT ---------- */
        const handler = viewer.screenSpaceEventHandler
        Object.values(Cesium.ScreenSpaceEventType).forEach((t) => handler.removeInputAction(t))

        console.log("[v0] Cesium initialized with", eventPins.length, "event pins")
      } catch (err) {
        console.error("[v0] Cesium init error:", err)
      }
    }

    initCesium()

    return () => {
      document.removeEventListener("visibilitychange", () => {})
      viewerRef.current?.destroy()
      viewerRef.current = null
    }
  }, [])

  return <div ref={containerRef} className="absolute inset-0" />
}
