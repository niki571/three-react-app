import React, { useEffect, useRef } from 'react'
import {
  useRouteMatch
} from 'react-router-dom'
import * as THREE from 'three'
import { WIDTH, HEIGHT } from './config'

export function Light () {
  const { path } = useRouteMatch()
  const width = path === '/' ? WIDTH : window.innerWidth
  const height = path === '/' ? HEIGHT : window.innerHeight

  const divEl = useRef(null)

  useEffect(() => {
    // === THREE.JS CODE START ===
    // create a scene, that will hold all our elements such as objects, cameras and lights.
    var scene = new THREE.Scene()

    // create a camera, which defines where we're looking at.
    var camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000)

    // create a render and configure it with shadows
    var renderer = new THREE.WebGLRenderer()
    renderer.setClearColor(new THREE.Color(0x000000))
    renderer.setSize(width, height)
    // renderer.shadowMap.enabled = true;

    // createTree(scene);
    // createHouse(scene);
    // createGroundPlane(scene);
    // createBoundingWall(scene);

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

    // add the objects
    scene.add(cube)
    scene.add(sphere)
    scene.add(plane)

    // position and point the camera to the center of the scene
    camera.position.x = -30
    camera.position.y = 40
    camera.position.z = 30
    camera.lookAt(scene.position)

    // add spotlight for the shadows
    var spotLight = new THREE.SpotLight(0xFFFFFF)
    spotLight.position.set(-40, 40, -15)
    spotLight.castShadow = true
    spotLight.shadow.mapSize = new THREE.Vector2(1024, 1024)
    spotLight.shadow.camera.far = 130
    spotLight.shadow.camera.near = 40

    // If you want a more detailled shadow you can increase the
    // mapSize used to draw the shadows.
    // spotLight.shadow.mapSize = new THREE.Vector2(1024, 1024);
    scene.add(spotLight)

    var ambienLight = new THREE.AmbientLight(0x353535)
    scene.add(ambienLight)

    // add the output of the renderer to the html element
    divEl.current.appendChild(renderer.domElement)

    // call the render function
    renderer.render(scene, camera)
    // === THREE.JS EXAMPLE CODE END ===
  }, [])

  return (
    <div ref={divEl} />
  )
}
