import React, { useEffect, useRef } from 'react'
import {
  useRouteMatch
} from 'react-router-dom'
import * as THREE from 'three'
import { WIDTH, HEIGHT } from './config'

export function Sphere () {
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

    // create a render and set the size
    var renderer = new THREE.WebGLRenderer()
    renderer.setClearColor(new THREE.Color(0x000000))
    renderer.setSize(width, height)

    // show axes in the screen
    var axes = new THREE.AxesHelper(20)
    scene.add(axes)

    // create the ground plane
    var planeGeometry = new THREE.PlaneGeometry(60, 20)
    var planeMaterial = new THREE.MeshBasicMaterial({
      color: 0xAAAAAA
    })
    var plane = new THREE.Mesh(planeGeometry, planeMaterial)

    // rotate and position the plane
    plane.rotation.x = -0.5 * Math.PI
    plane.position.set(15, 0, 0)

    // add the plane to the scene
    scene.add(plane)

    // create a cube
    var cubeGeometry = new THREE.BoxGeometry(4, 4, 4)
    var cubeMaterial = new THREE.MeshBasicMaterial({
      color: 0xFF0000,
      wireframe: true
    })
    var cube = new THREE.Mesh(cubeGeometry, cubeMaterial)

    // position the cube
    cube.position.set(-4, 3, 0)

    // add the cube to the scene
    scene.add(cube)

    // create a sphere
    var sphereGeometry = new THREE.SphereGeometry(4, 20, 20)
    var sphereMaterial = new THREE.MeshBasicMaterial({
      color: 0x7777FF,
      wireframe: true
    })
    var sphere = new THREE.Mesh(sphereGeometry, sphereMaterial)

    // position the sphere
    sphere.position.set(20, 4, 2)

    // add the sphere to the scene
    scene.add(sphere)

    // position and point the camera to the center of the scene
    camera.position.set(-30, 40, 30)
    camera.lookAt(scene.position)

    // add the output of the renderer to the html element
    divEl.current.appendChild(renderer.domElement)

    // render the scene
    renderer.render(scene, camera)
    // === THREE.JS EXAMPLE CODE END ===
  }, [])

  return (
    <div ref={divEl} />
  )
}
