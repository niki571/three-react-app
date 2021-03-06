import React, { useEffect, useRef } from 'react'
import {
  useRouteMatch
} from 'react-router-dom'
import * as THREE from 'three'
import { ConvexGeometry } from 'three/examples/jsm/geometries/ConvexGeometry.js'
import { ParametricGeometries } from 'three/examples/jsm/geometries/ParametricGeometries.js'
import { SceneUtils } from 'three/examples/jsm/utils/SceneUtils.js'
import Stats from 'stats.js'
import TrackballControls from 'three-trackballcontrols'
import { WIDTH, HEIGHT } from './config'

export function Geometry () {
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
    var planeMaterial = new THREE.MeshLambertMaterial({
      color: 0xffffff
    })
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
    camera.position.x = -50
    camera.position.y = 30
    camera.position.z = 20
    camera.lookAt(new THREE.Vector3(-10, 0, 0))

    // add subtle ambient lighting
    var ambientLight = new THREE.AmbientLight(0x555555)
    scene.add(ambientLight)

    // add spotlight for the shadows
    var spotLight = new THREE.SpotLight(0xffffff, 1.2, 150, Math.PI / 4, 0, 2)
    spotLight.shadow.mapSize.height = 1024
    spotLight.shadow.mapSize.width = 1024
    spotLight.position.set(-40, 30, 30)
    spotLight.castShadow = true
    scene.add(spotLight)

    // add the output of the renderer to the html element
    stats && divEl.current.appendChild(stats.dom)
    divEl.current.appendChild(renderer.domElement)
    // === THREE.JS EXAMPLE CODE END ===
    // add geometries
    addGeometries(scene)
    function addGeometries (scene) {
      var geoms = []

      geoms.push(new THREE.CylinderGeometry(1, 4, 4))

        // basic cube
      geoms.push(new THREE.BoxGeometry(2, 2, 2))

        // basic spherer
      geoms.push(new THREE.SphereGeometry(2))

      geoms.push(new THREE.IcosahedronGeometry(4))

        // create a convex shape (a shape without dents)
        // using a couple of points
        // for instance a cube
      var points = [
        new THREE.Vector3(2, 2, 2),
        new THREE.Vector3(2, 2, -2),
        new THREE.Vector3(-2, 2, -2),
        new THREE.Vector3(-2, 2, 2),
        new THREE.Vector3(2, -2, 2),
        new THREE.Vector3(2, -2, -2),
        new THREE.Vector3(-2, -2, -2),
        new THREE.Vector3(-2, -2, 2)
      ]
      geoms.push(new ConvexGeometry(points))

        // create a lathgeometry
        // http://en.wikipedia.org/wiki/Lathe_(graphics)
      var pts = [] // points array - the path profile points will be stored here
      var detail = 0.1 // half-circle detail - how many angle increments will be used to generate points
      var radius = 3 // radius for half_sphere
      // loop from 0.0 radians to PI (0 - 180 degrees)
      for (var angle = 0.0; angle < Math.PI; angle += detail) {
        pts.push(new THREE.Vector3(Math.cos(angle) * radius, 0, Math.sin(angle) * radius))
      } // angle/radius to x,z
      geoms.push(new THREE.LatheGeometry(pts, 12))

        // create a OctahedronGeometry
      geoms.push(new THREE.OctahedronGeometry(3))

        // create a geometry based on a function
      geoms.push(new THREE.ParametricGeometry(ParametricGeometries.mobius3d, 20, 10))

        //
      geoms.push(new THREE.TetrahedronGeometry(3))

      geoms.push(new THREE.TorusGeometry(3, 1, 10, 10))

      geoms.push(new THREE.TorusKnotGeometry(3, 0.5, 50, 20))

      var j = 0
      for (var i = 0; i < geoms.length; i++) {
        // var cubeMaterial = new THREE.MeshLambertMaterial({
        //   wireframe: true,
        //   color: Math.random() * 0xffffff
        // })

        var materials = [

          new THREE.MeshLambertMaterial({
            color: Math.random() * 0xffffff
          }),
          new THREE.MeshBasicMaterial({
            color: 0x000000,
            wireframe: true
          })

        ]

        var mesh = SceneUtils.createMultiMaterialObject(geoms[i], materials)
        mesh.traverse(function (e) {
          e.castShadow = true
        })

            // var mesh = new THREE.Mesh(geoms[i],materials[i]);
            // mesh.castShadow=true;
        mesh.position.x = -24 + ((i % 4) * 12)
        mesh.position.y = 4
        mesh.position.z = -8 + (j * 12)

        if ((i + 1) % 4 === 0) j++
        scene.add(mesh)
      }
    }
    let trackballControls
    let clock

    if (path !== '/') {
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
  }, [])

  return (
    <div ref={divEl} />
  )
}
