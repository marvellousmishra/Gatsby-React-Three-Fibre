import React, { useState, useRef, useEffect } from "react"
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"
import { Canvas, extend, useThree, useRender } from "react-three-fiber"

import "./style.css"

extend({ OrbitControls })

const DuckPlane = () => {
  const [model, setModel] = useState()

  useEffect(() => {
    new GLTFLoader().load("/scene.gltf", setModel)
  })

  return model ? <primitive object={model.scene} /> : null
}

const Controls = () => {
  const orbitRef = useRef()
  const { camera, gl } = useThree()

  useRender(() => {
    orbitRef.current.update()
  })

  return (
    <orbitControls
      autoRotate
      
      args={[camera, gl.domElement]}
      ref={orbitRef}
    />
  )
}

const Plane = () => (
  <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -100, 0]} receiveShadow>
    <planeBufferGeometry attach="geometry" args={[10000, 10000]} />
    <meshPhysicalMaterial attach="material" color="#3381c0" />
  </mesh>
)
export default () => {
  const isBrowser = typeof window !== "undefined"

  return (
    <>
      {isBrowser && (
        <Canvas
          camera={{ position: [100, 100, 300] }}
          onCreated={({ gl }) => {
            gl.shadowMap.enabled = true
            gl.shadowMap.type = THREE.PCFSoftShadowMap
          }}
        >
          <ambientLight intensity={0.5} />
          <spotLight position={[100, 1000, 100]} penumbra={1} />
          <fog attach="fog" args={["#b4e3ff", 5, 1000]} />
          <Controls />
          <Plane />
          <DuckPlane/>
        </Canvas>
      )}
    </>
  )
}
