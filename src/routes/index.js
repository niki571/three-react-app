import React from 'react'
import App from '../components/app/App'
import Cube from '../components/three/Cube'
import Sphere from '../components/three/Sphere'

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
