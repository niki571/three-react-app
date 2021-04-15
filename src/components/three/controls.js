import React, { useEffect, useRef } from 'react'
import {
  useRouteMatch
} from 'react-router-dom'
import * as THREE from 'three'
import Stats from 'stats.js'
import * as dat from 'dat.gui'
import TrackballControls from 'three-trackballcontrols'
import { WIDTH, HEIGHT } from './config'

export function Controls () {
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

  // create a render and set the size
    var renderer = new THREE.WebGLRenderer()

    renderer.setClearColor(new THREE.Color(0x000000))
    renderer.setSize(width, height)
    renderer.shadowMap.enabled = true

  // create the ground plane
    var planeGeometry = new THREE.PlaneGeometry(60, 40, 1, 1)
    var planeMaterial = new THREE.MeshLambertMaterial({color: 0xffffff})
    var plane = new THREE.Mesh(planeGeometry, planeMaterial)
    plane.receiveShadow = true

  // rotate and position the plane
    plane.rotation.x = -0.5 * Math.PI
    plane.position.x = 0
    plane.position.y = 0
    plane.position.z = 0

  // add the plane to the scene
    scene.add(plane)

  // position and point the camera to the center of the scene
    camera.position.x = -30
    camera.position.y = 40
    camera.position.z = 30
    camera.lookAt(scene.position)

  // add subtle ambient lighting
    var ambientLight = new THREE.AmbientLight(0x3c3c3c)
    scene.add(ambientLight)

  // add spotlight for the shadows
  // add spotlight for the shadows
    var spotLight = new THREE.SpotLight(0xffffff, 1, 180, Math.PI / 4)
    spotLight.shadow.mapSize.height = 2048
    spotLight.shadow.mapSize.width = 2048
    spotLight.position.set(-40, 30, 30)
    spotLight.castShadow = true
    scene.add(spotLight)

    // add the output of the renderer to the html element
    stats && divEl.current.appendChild(stats.dom)
    divEl.current.appendChild(renderer.domElement)
    // === THREE.JS EXAMPLE CODE END ===

    var controls = new function () {
      this.scaleX = 1
      this.scaleY = 1
      this.scaleZ = 1

      this.positionX = 0
      this.positionY = 4
      this.positionZ = 0

      this.rotationX = 0
      this.rotationY = 0
      this.rotationZ = 0
      this.scale = 1

      this.translateX = 0
      this.translateY = 0
      this.translateZ = 0

      this.visible = true

      this.translate = function () {
        cube.translateX(controls.translateX)
        cube.translateY(controls.translateY)
        cube.translateZ(controls.translateZ)

        controls.positionX = cube.position.x
        controls.positionY = cube.position.y
        controls.positionZ = cube.position.z
      }
    }()

    var material = new THREE.MeshLambertMaterial({color: 0x44ff44})
    var geom = new THREE.BoxGeometry(5, 8, 3)

  // var materials = [
  //   new THREE.MeshLambertMaterial({opacity: 0.8, color: 0x44ff44, transparent: true}),
  //   new THREE.MeshBasicMaterial({color: 0x000000, wireframe: true})
  // ];

  // var cube = THREE.SceneUtils.createMultiMaterialObject(geom, materials);

    var cube = new THREE.Mesh(geom, material)
    cube.position.y = 4
    cube.castShadow = true
    scene.add(cube)

    let trackballControls
    let clock

    if (path !== '/') {
      var gui = new dat.GUI()

      let guiScale = gui.addFolder('scale')
      guiScale.add(controls, 'scaleX', 0, 5)
      guiScale.add(controls, 'scaleY', 0, 5)
      guiScale.add(controls, 'scaleZ', 0, 5)

      let guiPosition = gui.addFolder('position')
      var contX = guiPosition.add(controls, 'positionX', -10, 10)
      var contY = guiPosition.add(controls, 'positionY', -4, 20)
      var contZ = guiPosition.add(controls, 'positionZ', -10, 10)

      contX.listen()
      contX.onChange(function () {
        cube.position.x = controls.positionX
            // cube.children[1].position.x = controls.positionX;
      })

      contY.listen()
      contY.onChange(function () {
        cube.position.y = controls.positionY
      })

      contZ.listen()
      contZ.onChange(function () {
        cube.position.z = controls.positionZ
      })

      let guiRotation = gui.addFolder('rotation')
      guiRotation.add(controls, 'rotationX', -4, 4)
      guiRotation.add(controls, 'rotationY', -4, 4)
      guiRotation.add(controls, 'rotationZ', -4, 4)

      let guiTranslate = gui.addFolder('translate')

      guiTranslate.add(controls, 'translateX', -10, 10)
      guiTranslate.add(controls, 'translateY', -10, 10)
      guiTranslate.add(controls, 'translateZ', -10, 10)
      guiTranslate.add(controls, 'translate')

      gui.add(controls, 'visible')
      // attach them here, since appendChild needs to be called first
      trackballControls = new TrackballControls(camera, renderer.domElement)
      clock = new THREE.Clock()
    }

    function renderScene () {
      stats && stats.update()
      trackballControls && trackballControls.update(clock.getDelta())

      cube.visible = controls.visible

      cube.rotation.x = controls.rotationX
      cube.rotation.y = controls.rotationY
      cube.rotation.z = controls.rotationZ

      cube.scale.set(controls.scaleX, controls.scaleY, controls.scaleZ)

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
