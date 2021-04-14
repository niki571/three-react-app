import React, { useEffect, useRef } from 'react'
import {
  useRouteMatch
} from 'react-router-dom'
import * as THREE from 'three'
import Stats from 'stats.js'
import * as dat from 'dat.gui'
import TrackballControls from 'three-trackballcontrols'
import { WIDTH, HEIGHT } from './config'

export function Animation () {
  const divEl = useRef(null)

  const { path } = useRouteMatch()
  const width = path === '/' ? WIDTH : window.innerWidth
  const height = path === '/' ? HEIGHT : window.innerHeight

  let stats
  if (path !== '/') {
    stats = new Stats()
    stats.showPanel(0)
  }

  // === THREE.JS CODE START ===
    // default setup
  var scene = new THREE.Scene()
  var camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000)
  var renderer = new THREE.WebGLRenderer()

  renderer.setClearColor(new THREE.Color(0x000000))
  renderer.setSize(width, height)
  renderer.shadowMap.enabled = true

    // create the ground plane
  var planeGeometry = new THREE.PlaneGeometry(60, 20, 1, 1)
  var planeMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff })
  var plane = new THREE.Mesh(planeGeometry, planeMaterial)
  plane.receiveShadow = true

    // rotate and position the plane
  plane.rotation.x = -0.5 * Math.PI
  plane.position.x = 15
  plane.position.y = 0
  plane.position.z = 0

    // add the plane to the scene
  scene.add(plane)

    // create a cube
  var cubeGeometry = new THREE.BoxGeometry(4, 4, 4)
  var cubeMaterial = new THREE.MeshLambertMaterial({ color: 0xff0000 })
  var cube = new THREE.Mesh(cubeGeometry, cubeMaterial)
  cube.castShadow = true

    // position the cube
  cube.position.x = -4
  cube.position.y = 4
  cube.position.z = 0

    // add the cube to the scene
  scene.add(cube)

  var sphereGeometry = new THREE.SphereGeometry(4, 20, 20)
  var sphereMaterial = new THREE.MeshLambertMaterial({ color: 0x7777ff })
  var sphere = new THREE.Mesh(sphereGeometry, sphereMaterial)

    // position the sphere
  sphere.position.x = 20
  sphere.position.y = 0
  sphere.position.z = 2
  sphere.castShadow = true

    // add the sphere to the scene
  scene.add(sphere)

    // position and point the camera to the center of the scene
  camera.position.x = -30
  camera.position.y = 40
  camera.position.z = 30
  camera.lookAt(scene.position)

    // add subtle ambient lighting
  var ambienLight = new THREE.AmbientLight(0x353535)
  scene.add(ambienLight)

    // add spotlight for the shadows
  var spotLight = new THREE.SpotLight(0xffffff)
  spotLight.position.set(-10, 20, -5)
  spotLight.castShadow = true
  scene.add(spotLight)

   // === THREE.JS EXAMPLE CODE END ===
  let step = 0
  let trackballControls
  let controls = new function () {
    this.rotationSpeed = 0.02
    this.bouncingSpeed = 0.03
  }()
  if (path !== '/') {
    let gui = new dat.GUI()
    gui.add(controls, 'rotationSpeed', 0, 0.5)
    gui.add(controls, 'bouncingSpeed', 0, 0.5)

     // attach them here, since appendChild needs to be called first
    trackballControls = new TrackballControls(camera, renderer.domElement)
  }

  useEffect(() => {
    // add the output of the renderer to the html element
    stats && divEl.current.appendChild(stats.dom)
    divEl.current.appendChild(renderer.domElement)

    function renderScene () {
      stats && stats.update()
      trackballControls && trackballControls.update()

        // rotate the cube around its axes
      cube.rotation.x += controls.rotationSpeed
      cube.rotation.y += controls.rotationSpeed
      cube.rotation.z += controls.rotationSpeed

        // bounce the sphere up and down
      step += controls.bouncingSpeed
      sphere.position.x = 20 + (10 * (Math.cos(step)))
      sphere.position.y = 2 + (10 * Math.abs(Math.sin(step)))

        // render using requestAnimationFrame
      window.requestAnimationFrame(renderScene)
      renderer.render(scene, camera)
    }
    renderScene()
  }, [])

  return (
    <div ref={divEl} />
  )
}
