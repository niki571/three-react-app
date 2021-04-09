import React from 'react'
import {
  Link
} from 'react-router-dom'
import Wrapper from '../wrapper'
import routes from '../../routes'
import './App.css'

function App () {
  const canvasList = routes.slice(1)

  return (
    <div className='App'>
      {canvasList && canvasList.map((route, index) => {
        return <Link key={index} to={route.path}>
          <Wrapper>
            {route.main}
          </Wrapper>
        </Link>
      })}
    </div>
  )
}

export default App
