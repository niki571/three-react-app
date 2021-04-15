import React, { useEffect, useRef } from 'react'
import {
  useRouteMatch
} from 'react-router-dom'
import * as THREE from 'three'
import { WIDTH, HEIGHT } from './config'

export function Cube () {
  const divEl = useRef(null)

  const { path } = useRouteMatch()
  const width = path === '/' ? WIDTH : window.innerWidth
  const height = path === '/' ? HEIGHT : window.innerHeight

  useEffect(() => {
    console.log('Using Three.js version: ' + THREE.REVISION)
  // === THREE.JS CODE START ===
    var scene = new THREE.Scene()
    var camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000)
    var renderer = new THREE.WebGLRenderer()
    renderer.setSize(width, height)

    var geometry = new THREE.BoxGeometry(1, 1, 1)
    var material = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
    var cube = new THREE.Mesh(geometry, material)
    scene.add(cube)

    camera.position.z = 5
    divEl.current.appendChild(renderer.domElement)

    var animate = function () {
      window.requestAnimationFrame(animate)
      cube.rotation.x += 0.01
      cube.rotation.y += 0.01
      renderer.render(scene, camera)
    }
    animate()
    // === THREE.JS EXAMPLE CODE END ===
  }, [])

  return (
    <div ref={divEl} />
  )
}
