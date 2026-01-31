


import { useEffect, useRef } from "react"
import * as Cesium from "cesium"
let googleTilesetPromise = null



export default function CesiumMap({ events, selectedEvent, onEventSelect }) {
  const cesiumContainerRef = useRef(null)
  const viewerRef = useRef(null)
  const entitiesRef = useRef({})

  useEffect(() => {
    // Prevent double init (React StrictMode)
    if (viewerRef.current) return

    Cesium.Ion.defaultAccessToken = import.meta.env.VITE_CESIUM_TOKEN

    const viewer = new Cesium.Viewer(cesiumContainerRef.current, {
      globe: false, // REQUIRED for Google Photorealistic Tiles
      skyAtmosphere: new Cesium.SkyAtmosphere(),
      baseLayerPicker: false,
      sceneModePicker: false,
      animation: false,
      timeline: false,
      infoBox: false,
      selectionIndicator: true,
      fullscreenButton: true,
      homeButton: true,
      creditContainer: "cesium-credit-container",
      geocoder: Cesium.IonGeocodeProviderType.GOOGLE,
      sceneMode: Cesium.SceneMode.SCENE3D,
    })

    viewerRef.current = viewer

    // Camera controls
    const controller = viewer.scene.screenSpaceCameraController

    controller.enableTilt = true
    controller.enableLook = true
    controller.enableRotate = true
    controller.enableTranslate = true
    controller.enableZoom = true

    controller.tiltEventTypes = [
      Cesium.CameraEventType.RIGHT_DRAG,
      Cesium.CameraEventType.MIDDLE_DRAG,
    ]

    controller.lookEventTypes = [
      Cesium.CameraEventType.RIGHT_DRAG,
    ]

    controller.minimumPitch = Cesium.Math.toRadians(-89.0)
    controller.maximumPitch = Cesium.Math.toRadians(0.0)

    let cancelled = false

    // Load Google Photorealistic 3D Tiles
  if (!googleTilesetPromise) {
  googleTilesetPromise = Cesium.createGooglePhotorealistic3DTileset()
}

googleTilesetPromise
  .then((tileset) => {
    const currentViewer = viewerRef.current
    if (cancelled || !currentViewer || currentViewer.isDestroyed()) return

    // Prevent adding twice
    if (!currentViewer.scene.primitives.contains(tileset)) {
      currentViewer.scene.primitives.add(tileset)
    }
  })
  .catch((err) => {
    console.error("Failed to load Google Photorealistic 3D Tiles", err)
  })


    return () => {
      cancelled = true
      if (viewer && !viewer.isDestroyed()) {
        viewer.destroy()
      }
      viewerRef.current = null
    }
  }, [])

  // Update pins
  useEffect(() => {
    if (!viewerRef.current) return

    const viewer = viewerRef.current

    Object.values(entitiesRef.current).forEach((entity) => {
      viewer.entities.remove(entity)
    })
    entitiesRef.current = {}

    events.forEach((event) => {
      const colorMap = {
        hackathon: Cesium.Color.CYAN,
        workshop: Cesium.Color.ORANGE,
        event: Cesium.Color.LIME,
      }

      const entity = viewer.entities.add({
        id: event._id,
        position: Cesium.Cartesian3.fromDegrees(
          event.location.lon,
          event.location.lat,
          40
        ),
        point: {
          pixelSize: 12,
          color: colorMap[event.type],
          outlineColor: Cesium.Color.WHITE,
          outlineWidth: 2,
         heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
        },
        label: {
          text: event.title,
          font: "12px sans-serif",
          fillColor: Cesium.Color.WHITE,
          backgroundColor: new Cesium.Color(0, 0, 0, 0.7),
          backgroundPadding: new Cesium.Cartesian2(8, 4),
          pixelOffset: new Cesium.Cartesian2(0, -25),
          showBackground: true,
          horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
          heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
        },
        properties: {
          eventId: event._id,
        },
      })

      entitiesRef.current[event._id] = entity
    })
  }, [events])

  // Fly to selected event
  useEffect(() => {
    if (!viewerRef.current || !selectedEvent) return

    const viewer = viewerRef.current
    const entity = viewer.entities.getById(selectedEvent._id)
    if (!entity) return

    viewer.flyTo(entity, {
      duration: 1.5,
      offset: new Cesium.HeadingPitchRange(
        Cesium.Math.toRadians(0),
        Cesium.Math.toRadians(-65),
        900
      ),
    })
  }, [selectedEvent])

  return (
    <div className="flex-1 h-full relative">
      <div ref={cesiumContainerRef} className="w-full h-full" />
      <div
        id="cesium-credit-container"
        className="absolute bottom-2 right-2 text-xs text-muted-foreground opacity-50"
      />
    </div>
  )
}
