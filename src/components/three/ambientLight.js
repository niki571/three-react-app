import React, { useEffect, useRef } from 'react'
import {
  useRouteMatch
} from 'react-router-dom'
import * as THREE from 'three'
import Stats from 'stats.js'
import * as dat from 'dat.gui'
import TrackballControls from 'three-trackballcontrols'
import { WIDTH, HEIGHT } from './config'

export function AmbientLight () {
  const divEl = useRef(null)

  const { path } = useRouteMatch()
  const width = path === '/' ? WIDTH : window.innerWidth
  const height = path === '/' ? HEIGHT : window.innerHeight

  useEffect(() => {
    let stats
    if (path !== '/') {
      stats = new Stats()
      stats.showPanel(0)
    }
    // === THREE.JS CODE START ===
    // create a scene, that will hold all our elements such as objects, cameras and lights.
    var scene = new THREE.Scene()

    // create a camera, which defines where we're looking at.
    var camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000)
    // position and point the camera to the center of the scene
    camera.position.x = -30
    camera.position.y = 40
    camera.position.z = 30
    camera.lookAt(scene.position)

    // create a render and configure it with shadows
    var renderer = new THREE.WebGLRenderer()
    renderer.setClearColor(new THREE.Color(0x000000))
    renderer.setSize(width, height)
    renderer.shadowMap.enabled = true

    createTree(scene)

    // create the ground plane
    var planeGeometry = new THREE.PlaneGeometry(60, 20)
    var planeMaterial = new THREE.MeshLambertMaterial({
      color: 0xAAAAAA
    })
    var plane = new THREE.Mesh(planeGeometry, planeMaterial)

    // rotate and position the plane
    plane.rotation.x = -0.5 * Math.PI
    plane.position.set(15, 0, 0)
    plane.receiveShadow = true

    scene.add(plane)

    // add ambient lighting
    var ambientLight = new THREE.AmbientLight('#606008', 1)
    scene.add(ambientLight)

    // add spotlight for the shadows
    var spotLight = new THREE.SpotLight(0xffffff, 1, 180, Math.PI / 4)
    spotLight.shadow.mapSize.set(2048, 2048)
    spotLight.position.set(-30, 40, -10)
    spotLight.castShadow = true
    scene.add(spotLight)

    // add the output of the renderer to the html element
    divEl.current.appendChild(renderer.domElement)

    // === THREE.JS EXAMPLE CODE END ===
    function setupControls () {
      var controls = new function () {
        this.intensity = ambientLight.intensity
        this.ambientColor = ambientLight.color.getStyle()
        this.disableSpotlight = false
      }()

      var gui = new dat.GUI()
      gui.add(controls, 'intensity', 0, 3, 0.1).onChange(function () {
        ambientLight.intensity = controls.intensity
      })
      gui.addColor(controls, 'ambientColor').onChange(function () {
        ambientLight.color = new THREE.Color(controls.ambientColor)
      })
      gui.add(controls, 'disableSpotlight').onChange(function (e) {
        spotLight.visible = !e
      })
      return controls
    }

    let trackballControls
    let clock

    if (path !== '/') {
      setupControls()
        // attach them here, since appendChild needs to be called first
      trackballControls = new TrackballControls(camera, renderer.domElement)
      clock = new THREE.Clock()
    }

    function renderScene () {
      stats && stats.update()
      trackballControls && trackballControls.update(clock.getDelta())

        // render using requestAnimationFrame
      window.requestAnimationFrame(renderScene)
      renderer.render(scene, camera)
    }
    renderScene()

    /**
     * Add the tree to the scene
     * @param scene The scene to add the tree to
     */
    function createTree (scene) {
      var trunk = new THREE.BoxGeometry(1, 8, 1)
      var leaves = new THREE.SphereGeometry(4)

    // create the mesh
      var trunkMesh = new THREE.Mesh(trunk, new THREE.MeshLambertMaterial({
        color: 0x8b4513
      }))
      var leavesMesh = new THREE.Mesh(leaves, new THREE.MeshLambertMaterial({
        color: 0x00ff00
      }))

    // position the trunk. Set y to half of height of trunk
      trunkMesh.position.set(-10, 4, 0)
      leavesMesh.position.set(-10, 12, 0)

      trunkMesh.castShadow = true
      trunkMesh.receiveShadow = true
      leavesMesh.castShadow = true
      leavesMesh.receiveShadow = true

      scene.add(trunkMesh)
      scene.add(leavesMesh)
    }
  }, [])

  return (
    <div ref={divEl} />
  )
}
