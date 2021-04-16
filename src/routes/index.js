import React from 'react'
import App from '../components/app'
import { Cube, Cube2, Sphere, UnitsCube, Animation, Scene, Geometry, Controls, Camera,
  AmbientLight, SpotLight, PointLight
 } from '../components/three'

const routes = [
  {
    path: '/',
    exact: true,
    main: <App />
  },
  {
    path: '/cube',
    main: <Cube />
  },
  {
    path: '/cube2',
    main: <Cube2 />
  },
  {
    path: '/sphere',
    main: <Sphere />
  },
  {
    path: '/unitsCube',
    main: <UnitsCube />
  },
  {
    path: '/animation',
    main: <Animation />
  },
  {
    path: '/scene',
    main: <Scene />
  },
  {
    path: '/geometry',
    main: <Geometry />
  },
  {
    path: '/controls',
    main: <Controls />
  },
  {
    path: '/camera',
    main: <Camera />
  },
  {
    path: '/ambientLight',
    main: <AmbientLight />
  },
  {
    path: '/spotLight',
    main: <SpotLight />
  },
  {
    path: '/pointLight',
    main: <PointLight />
  }
]

export default routes
