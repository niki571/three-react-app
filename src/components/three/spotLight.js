import React, { useEffect, useRef } from 'react'
import {
  useRouteMatch
} from 'react-router-dom'
import * as THREE from 'three'
import Stats from 'stats.js'
import * as dat from 'dat.gui'
import TrackballControls from 'three-trackballcontrols'
import { WIDTH, HEIGHT } from './config'

export function SpotLight () {
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
    var ambiColor = '#1c1c1c'
    var ambientLight = new THREE.AmbientLight(ambiColor)
    scene.add(ambientLight)

  // add spotlight for a bit of light
    var spotLight0 = new THREE.SpotLight(0xcccccc)
    spotLight0.position.set(-40, 30, -10)
    spotLight0.lookAt(plane)
    scene.add(spotLight0)

  // add target and light
    var target = new THREE.Object3D()
    target.position.set(5, 0, 0)

    var spotLight = new THREE.SpotLight('#ffffff')
    spotLight.position.set(-40, 60, -10)
    spotLight.castShadow = true
    spotLight.shadow.camera.near = 1
    spotLight.shadow.camera.far = 100
    spotLight.target = plane
    spotLight.distance = 0
    spotLight.angle = 0.4
    spotLight.shadow.camera.fov = 120
    scene.add(spotLight)
    var debugCamera = new THREE.CameraHelper(spotLight.shadow.camera)

    var pp = new THREE.SpotLightHelper(spotLight)
    scene.add(pp)

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

    var controls = new function () {
      this.rotationSpeed = 0.03
      this.bouncingSpeed = 0.03
      this.ambientColor = ambiColor
      this.pointColor = spotLight.color.getStyle()
      this.intensity = 1
      this.distance = 0
      this.angle = 0.1
      this.shadowDebug = false
      this.castShadow = true
      this.target = 'Plane'
      this.stopMovingLight = false
      this.penumbra = 0
    }()

    let trackballControls
    let clock

    if (path !== '/') {
      var gui = new dat.GUI()
      gui.addColor(controls, 'ambientColor').onChange(function (e) {
        ambientLight.color = new THREE.Color(e)
      })

      gui.addColor(controls, 'pointColor').onChange(function (e) {
        spotLight.color = new THREE.Color(e)
      })

      gui.add(controls, 'angle', 0, Math.PI * 2).onChange(function (e) {
        spotLight.angle = e
      })

      gui.add(controls, 'intensity', 0, 5).onChange(function (e) {
        spotLight.intensity = e
      })

      gui.add(controls, 'penumbra', 0, 1).onChange(function (e) {
        spotLight.penumbra = e
      })

      gui.add(controls, 'distance', 0, 200).onChange(function (e) {
        spotLight.distance = e
      })

      gui.add(controls, 'shadowDebug').onChange(function (e) {
        if (e) {
          scene.add(debugCamera)
        } else {
          scene.remove(debugCamera)
        }
      })

      gui.add(controls, 'castShadow').onChange(function (e) {
        spotLight.castShadow = e
      })

      gui.add(controls, 'target', ['Plane', 'Sphere', 'Cube']).onChange(function (e) {
        switch (e) {
          case 'Plane':
            spotLight.target = plane
            break
          case 'Sphere':
            spotLight.target = sphere
            break
          case 'Cube':
            spotLight.target = cube
            break
        }
      })

      gui.add(controls, 'stopMovingLight').onChange(function (e) {
        console.log(3333)
        controls.stopMovingLight = !e
      })

        // attach them here, since appendChild needs to be called first
      trackballControls = new TrackballControls(camera, renderer.domElement)
      clock = new THREE.Clock()
    }

    var step = 0
    var invert = 1
    var phase = 0

    function renderScene () {
      stats && stats.update()
      trackballControls && trackballControls.update(clock.getDelta())

      // rotate the cube around its axes
      cube.rotation.x += controls.rotationSpeed
      cube.rotation.y += controls.rotationSpeed
      cube.rotation.z += controls.rotationSpeed

    // bounce the sphere up and down
      step += controls.bouncingSpeed
      sphere.position.x = 20 + (10 * (Math.cos(step)))
      sphere.position.y = 2 + (10 * Math.abs(Math.sin(step)))

    // move the light simulation
    //   console.log(4444, controls.stopMovingLight)
      if (!controls.stopMovingLight) {
        if (phase > 2 * Math.PI) {
          invert = invert * -1
          phase -= 2 * Math.PI
        } else {
          phase += controls.rotationSpeed
        }
        sphereLightMesh.position.z = +(7 * (Math.sin(phase)))
        sphereLightMesh.position.x = +(14 * (Math.cos(phase)))
        sphereLightMesh.position.y = 15

        if (invert < 0) {
          var pivot = 14
          sphereLightMesh.position.x = (invert * (sphereLightMesh.position.x - pivot)) + pivot
        }

        spotLight.position.copy(sphereLightMesh.position)
      }

      pp.update()
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
