import React, { useEffect, useRef } from 'react'
import {
  useRouteMatch
} from 'react-router-dom'
import * as THREE from 'three'
import Stats from 'stats.js'
import * as dat from 'dat.gui'
import TrackballControls from 'three-trackballcontrols'
import { WIDTH, HEIGHT } from './config'

export function PointLight () {
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

    // create a cube
    var cubeGeometry = new THREE.BoxGeometry(4, 4, 4)
    var cubeMaterial = new THREE.MeshLambertMaterial({
      color: 0xFF0000
    })
    var cube = new THREE.Mesh(cubeGeometry, cubeMaterial)
    cube.castShadow = true

    // position the cube
    cube.position.x = -4
    cube.position.y = 2
    cube.position.z = 0

    // add the cube to the scene

    var sphereGeometry = new THREE.SphereGeometry(4, 20, 20)
    var sphereMaterial = new THREE.MeshLambertMaterial({
      color: 0x7777ff
    })
    var sphere = new THREE.Mesh(sphereGeometry, sphereMaterial)

    // position the sphere
    sphere.position.x = 20
    sphere.position.y = 4
    sphere.position.z = 2
    sphere.castShadow = true

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

    scene.add(cube)
    scene.add(sphere)
    scene.add(plane)

    // add subtle ambient lighting
    var ambientLight = new THREE.AmbientLight('#0c0c0c')
    scene.add(ambientLight)

    // the point light where working with
    var pointColor = '#ccffcc'
    var pointLight = new THREE.PointLight(pointColor)
    pointLight.decay = 0.1

    pointLight.castShadow = true

    scene.add(pointLight)

    var helper = new THREE.PointLightHelper(pointLight)
    scene.add(helper)

    var shadowHelper = new THREE.CameraHelper(pointLight.shadow.camera)
    scene.add(shadowHelper)

    // add a small sphere simulating the pointlight
    var sphereLight = new THREE.SphereGeometry(0.2)
    var sphereLightMaterial = new THREE.MeshBasicMaterial({
      color: 0xac6c25
    })
    var sphereLightMesh = new THREE.Mesh(sphereLight, sphereLightMaterial)
    sphereLightMesh.position.set(3, 0, 5)
    scene.add(sphereLightMesh)

    // add the output of the renderer to the html element
    divEl.current.appendChild(renderer.domElement)

    // === THREE.JS EXAMPLE CODE END ===

    function setupControls () {
      var controls = new function () {
        this.rotationSpeed = 0.01
        this.bouncingSpeed = 0.03
        this.ambientColor = ambientLight.color.getStyle()
        this.pointColor = pointLight.color.getStyle()
        this.intensity = 1
        this.distance = pointLight.distance
      }()

      var gui = new dat.GUI()
      gui.addColor(controls, 'ambientColor').onChange(function (e) {
        ambientLight.color = new THREE.Color(e)
      })

      gui.addColor(controls, 'pointColor').onChange(function (e) {
        pointLight.color = new THREE.Color(e)
      })

      gui.add(controls, 'distance', 0, 100).onChange(function (e) {
        pointLight.distance = e
      })

      gui.add(controls, 'intensity', 0, 3).onChange(function (e) {
        pointLight.intensity = e
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

    var invert = 1
    var phase = 0

    function renderScene () {
      stats && stats.update()
      trackballControls && trackballControls.update(clock.getDelta())

      helper.update()
      shadowHelper.update()

      if (path !== '/') {
        // move the light simulation
        if (phase > 2 * Math.PI) {
          invert = invert * -1
          phase -= 2 * Math.PI
        } else {
          phase += controls.rotationSpeed
        }
        sphereLightMesh.position.z = +(25 * (Math.sin(phase)))
        sphereLightMesh.position.x = +(14 * (Math.cos(phase)))
        sphereLightMesh.position.y = 5

        if (invert < 0) {
          var pivot = 14
          sphereLightMesh.position.x = (invert * (sphereLightMesh.position.x - pivot)) + pivot
        }

        pointLight.position.copy(sphereLightMesh.position)
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
