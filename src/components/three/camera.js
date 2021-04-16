import React, { useEffect, useRef } from 'react'
import {
  useRouteMatch
} from 'react-router-dom'
import * as THREE from 'three'
import Stats from 'stats.js'
import * as dat from 'dat.gui'
import TrackballControls from 'three-trackballcontrols'
import { WIDTH, HEIGHT } from './config'

export function Camera () {
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
    camera.position.x = 120
    camera.position.y = 60
    camera.position.z = 180
    camera.lookAt(scene.position)

    // create a render and set the size
    var renderer = new THREE.WebGLRenderer()

    renderer.setClearColor(new THREE.Color(0x000000))
    renderer.setSize(width, height)

    // create the ground plane
    var planeGeometry = new THREE.PlaneGeometry(180, 180)
    var planeMaterial = new THREE.MeshLambertMaterial({color: 0xffffff})
    var plane = new THREE.Mesh(planeGeometry, planeMaterial)

    // rotate and position the plane
    plane.rotation.x = -0.5 * Math.PI
    plane.position.y = 0
    plane.position.z = 0

    // add the plane to the scene
    scene.add(plane)

    var cubeGeometry = new THREE.BoxGeometry(4, 4, 4)

    for (var j = 0; j < (planeGeometry.parameters.height / 5); j++) {
      for (var i = 0; i < planeGeometry.parameters.width / 5; i++) {
        var rnd = Math.random() * 0.75 + 0.25
        var cubeMaterial = new THREE.MeshLambertMaterial()
        cubeMaterial.color = new THREE.Color(rnd, 0, 0)
        var cube = new THREE.Mesh(cubeGeometry, cubeMaterial)

        cube.position.z = -((planeGeometry.parameters.height) / 2) + 2 + (j * 5)
        cube.position.x = -((planeGeometry.parameters.width) / 2) + 2 + (i * 5)
        cube.position.y = 2

        scene.add(cube)
      }
    }

    var lookAtGeom = new THREE.SphereGeometry(2)
    var lookAtMesh = new THREE.Mesh(lookAtGeom, new THREE.MeshLambertMaterial({color: 0x00ff00}))
    scene.add(lookAtMesh)

    var directionalLight = new THREE.DirectionalLight(0xffffff, 0.7)
    directionalLight.position.set(-20, 40, 60)
    scene.add(directionalLight)

    // add subtle ambient lighting
    var ambientLight = new THREE.AmbientLight(0x292929)
    scene.add(ambientLight)

    // add the output of the renderer to the html element
    stats && divEl.current.appendChild(stats.dom)
    divEl.current.appendChild(renderer.domElement)
    // === THREE.JS EXAMPLE CODE END ===

    var controls = new function () {
      this.perspective = 'Perspective'
      this.switchCamera = function () {
        if (camera instanceof THREE.PerspectiveCamera) {
          camera = new THREE.OrthographicCamera(window.innerWidth / -16, window.innerWidth / 16, window.innerHeight / 16, window.innerHeight / -16, -200, 500)
          camera.position.x = 120
          camera.position.y = 60
          camera.position.z = 180
          camera.lookAt(scene.position)

          trackballControls = new TrackballControls(camera, renderer.domElement)
          this.perspective = 'Orthographic'
        } else {
          camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000)
          camera.position.x = 120
          camera.position.y = 60
          camera.position.z = 180

          camera.lookAt(scene.position)
          trackballControls = new TrackballControls(camera, renderer.domElement)
          this.perspective = 'Perspective'
        }
      }
    }()

    let trackballControls
    let clock

    if (path !== '/') {
      var gui = new dat.GUI()
      gui.add(controls, 'switchCamera')
      gui.add(controls, 'perspective').listen()

      // attach them here, since appendChild needs to be called first
      trackballControls = new TrackballControls(camera, renderer.domElement)
      clock = new THREE.Clock()
    }

    let step = 0

    function renderScene () {
      stats && stats.update()
      trackballControls && trackballControls.update(clock.getDelta())

      step += 0.02
      if (camera instanceof THREE.Camera) {
        var x = 10 + (100 * (Math.sin(step)))
        camera.lookAt(new THREE.Vector3(x, 10, 0))
        lookAtMesh.position.copy(new THREE.Vector3(x, 10, 0))
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
