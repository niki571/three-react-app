import React from 'react'
import App from '../components/app'
import { Cube, Sphere, UnitsCube } from '../components/three'

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
    path: '/sphere',
    main: <Sphere />
  },
  {
    path: '/unitsCube',
    main: <UnitsCube />
  }
]

export default routes
