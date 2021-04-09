import React from 'react'
import App from '../components/app'
import Cube from '../components/three/cube'
import Sphere from '../components/three/sphere'

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
  }
]

export default routes
