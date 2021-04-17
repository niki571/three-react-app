import React, { useEffect, useRef } from 'react'
import {
  useRouteMatch
} from 'react-router-dom'
import * as THREE from 'three'
import Stats from 'stats.js'
import * as dat from 'dat.gui'
import TrackballControls from 'three-trackballcontrols'
import { WIDTH, HEIGHT } from './config'

export function HemisphereLight () {
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
    let textureGrass
    new THREE.TextureLoader().load('./grasslight-big.jpeg',
    (texture) => {
      console.log(888, texture)
      textureGrass = texture
      textureGrass.wrapS = THREE.RepeatWrapping
      textureGrass.wrapT = THREE.RepeatWrapping
      textureGrass.repeat.set(10, 10)
    })

    var planeGeometry = new THREE.PlaneGeometry(1000, 1000, 20, 20)
    var planeMaterial = new THREE.MeshLambertMaterial({
      map: textureGrass
    })

    //        var planeMaterial = new THREE.MeshLambertMaterial();
    var plane = new THREE.Mesh(planeGeometry, planeMaterial)
    plane.receiveShadow = true

    // rotate and position the plane
    plane.rotation.x = -0.5 * Math.PI
    plane.position.x = 15
    plane.position.y = 0
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

    // add spotlight for a bit of light
    var spotLight0 = new THREE.SpotLight(0xcccccc)
    spotLight0.position.set(-40, 60, -10)
    spotLight0.lookAt(plane)
    scene.add(spotLight0)

    var target = new THREE.Object3D()
    target.position.set(5, 0, 0)

    var hemiLight = new THREE.HemisphereLight(0x0000ff, 0x00ff00, 0.6)
    hemiLight.position.set(0, 500, 0)
    scene.add(hemiLight)

    var pointColor = '#ffffff'
    var dirLight = new THREE.DirectionalLight(pointColor)
    dirLight.position.set(30, 10, -50)
    dirLight.castShadow = true
    dirLight.target = plane
    dirLight.shadow.camera.near = 0.1
    dirLight.shadow.camera.far = 200
    dirLight.shadow.camera.left = -50
    dirLight.shadow.camera.right = 50
    dirLight.shadow.camera.top = 50
    dirLight.shadow.camera.bottom = -50
    dirLight.shadow.mapSize.width = 2048
    dirLight.shadow.mapSize.height = 2048
    scene.add(dirLight)

    // add the output of the renderer to the html element
    divEl.current.appendChild(renderer.domElement)

    // === THREE.JS EXAMPLE CODE END ===

    function setupControls () {
      var controls = new function () {
        this.rotationSpeed = 0.03
        this.bouncingSpeed = 0.03
        this.hemisphere = true
        this.color = 0x0000ff
        this.groundColor = 0x00ff00
        this.intensity = 0.6
      }()

      var gui = new dat.GUI()

      gui.add(controls, 'hemisphere').onChange(function (e) {
        if (!e) {
          hemiLight.intensity = 0
        } else {
          hemiLight.intensity = controls.intensity
        }
      })
      gui.addColor(controls, 'groundColor').onChange(function (e) {
        hemiLight.groundColor = new THREE.Color(e)
      })
      gui.addColor(controls, 'color').onChange(function (e) {
        hemiLight.color = new THREE.Color(e)
      })
      gui.add(controls, 'intensity', 0, 5).onChange(function (e) {
        hemiLight.intensity = e
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

      if (path !== '/') {
       // rotate the cube around its axes
        cube.rotation.x += controls.rotationSpeed
        cube.rotation.y += controls.rotationSpeed
        cube.rotation.z += controls.rotationSpeed

    // bounce the sphere up and down
        step += controls.bouncingSpeed
        sphere.position.x = 20 + (10 * (Math.cos(step)))
        sphere.position.y = 2 + (10 * Math.abs(Math.sin(step)))
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
