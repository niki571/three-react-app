import React, { useEffect, useRef } from 'react'
import {
  useRouteMatch
} from 'react-router-dom'
import * as THREE from 'three'
import Stats from 'stats.js'
import * as dat from 'dat.gui'
import TrackballControls from 'three-trackballcontrols'
import { WIDTH, HEIGHT } from './config'

export function DirectionalLight () {
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
    camera.position.x = -80
    camera.position.y = 80
    camera.position.z = 80
    camera.lookAt(scene.position)

    // create a render and configure it with shadows
    var renderer = new THREE.WebGLRenderer()
    renderer.setClearColor(new THREE.Color(0x000000))
    renderer.setSize(width, height)
    renderer.shadowMap.enabled = true

   // create the ground plane
    var planeGeometry = new THREE.PlaneGeometry(600, 200, 20, 20)
    var planeMaterial = new THREE.MeshLambertMaterial({
      color: 0xffffff
    })
    var plane = new THREE.Mesh(planeGeometry, planeMaterial)
    plane.receiveShadow = true

  // rotate and position the plane
    plane.rotation.x = -0.5 * Math.PI
    plane.position.x = 15
    plane.position.y = -5
    plane.position.z = 0

    // create a cube
    var cubeGeometry = new THREE.BoxGeometry(4, 4, 4)
    var cubeMaterial = new THREE.MeshLambertMaterial({
      color: 0xff3333
    })
    var cube = new THREE.Mesh(cubeGeometry, cubeMaterial)
    cube.castShadow = true

    // position the cube
    cube.position.x = -4
    cube.position.y = 3
    cube.position.z = 0

    var sphereGeometry = new THREE.SphereGeometry(4, 20, 20)
    var sphereMaterial = new THREE.MeshLambertMaterial({
      color: 0x7777ff
    })
    var sphere = new THREE.Mesh(sphereGeometry, sphereMaterial)

    // position the sphere
    sphere.position.x = 20
    sphere.position.y = 0
    sphere.position.z = 2
    sphere.castShadow = true

    scene.add(cube)
    scene.add(sphere)
    scene.add(plane)

    // add subtle ambient lighting
    var ambiColor = '#1c1c1c'
    var ambientLight = new THREE.AmbientLight(ambiColor)
    scene.add(ambientLight)

    var pointColor = '#ff5808'
    var directionalLight = new THREE.DirectionalLight(pointColor)
    directionalLight.position.set(-40, 60, -10)
    directionalLight.castShadow = true
    directionalLight.shadow.camera.near = 2
    directionalLight.shadow.camera.far = 80
    directionalLight.shadow.camera.left = -30
    directionalLight.shadow.camera.right = 30
    directionalLight.shadow.camera.top = 30
    directionalLight.shadow.camera.bottom = -30

    directionalLight.intensity = 0.5
    directionalLight.shadow.mapSize.width = 1024
    directionalLight.shadow.mapSize.height = 1024

    scene.add(directionalLight)

    var shadowHelper = new THREE.CameraHelper(directionalLight.shadow.camera)
    scene.add(shadowHelper)

  // add a small sphere simulating the pointlight
    var sphereLight = new THREE.SphereGeometry(0.2)
    var sphereLightMaterial = new THREE.MeshBasicMaterial({
      color: 0xac6c25
    })
    var sphereLightMesh = new THREE.Mesh(sphereLight, sphereLightMaterial)
    sphereLightMesh.castShadow = true

    sphereLightMesh.position.set(3, 20, 3)
    scene.add(sphereLightMesh)

    // add the output of the renderer to the html element
    divEl.current.appendChild(renderer.domElement)

    // === THREE.JS EXAMPLE CODE END ===

    function setupControls () {
      var controls = new function () {
        this.rotationSpeed = 0.03
        this.bouncingSpeed = 0.03
        this.ambientColor = ambiColor
        this.pointColor = pointColor
        this.intensity = 0.5
        this.debug = false
        this.castShadow = true
        this.onlyShadow = false
        this.target = 'Plane'
      }()

      var gui = new dat.GUI()

      gui.addColor(controls, 'ambientColor').onChange(function (e) {
        ambientLight.color = new THREE.Color(e)
      })

      gui.addColor(controls, 'pointColor').onChange(function (e) {
        directionalLight.color = new THREE.Color(e)
      })

      gui.add(controls, 'intensity', 0, 5).onChange(function (e) {
        directionalLight.intensity = e
      })

      gui.add(controls, 'debug').onChange(function (e) {
        e ? scene.add(shadowHelper) : scene.remove(shadowHelper)
      })

      gui.add(controls, 'castShadow').onChange(function (e) {
        directionalLight.castShadow = e
      })

      gui.add(controls, 'onlyShadow').onChange(function (e) {
        directionalLight.onlyShadow = e
      })

      gui.add(controls, 'target', ['Plane', 'Sphere', 'Cube']).onChange(function (e) {
        console.log(e)
        switch (e) {
          case 'Plane':
            directionalLight.target = plane
            break
          case 'Sphere':
            directionalLight.target = sphere
            break
          case 'Cube':
            directionalLight.target = cube
            break
        }
      })
      return controls
    }

    let trackballControls
    let clock
    let controls

    if (path !== '/') {
      controls = setupControls()
      // attach them here, since appendChild needs to be called first
      trackballControls = new TrackballControls(camera, renderer.domElement)
      clock = new THREE.Clock()
    }

    let step = 0

    function renderScene () {
      stats && stats.update()
      trackballControls && trackballControls.update(clock.getDelta())

      shadowHelper.update()

      if (path !== '/') {
        // rotate the cube around its axes
        cube.rotation.x += controls.rotationSpeed
        cube.rotation.y += controls.rotationSpeed
        cube.rotation.z += controls.rotationSpeed

        // bounce the sphere up and down
        step += controls.bouncingSpeed
        sphere.position.x = 20 + (10 * (Math.cos(step)))
        sphere.position.y = 2 + (10 * Math.abs(Math.sin(step)))

        sphereLightMesh.position.z = -8
        sphereLightMesh.position.y = +(27 * (Math.sin(step / 3)))
        sphereLightMesh.position.x = 10 + (26 * (Math.cos(step / 3)))

        directionalLight.position.copy(sphereLightMesh.position)
      }

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
