import React from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Route
} from 'react-router-dom'
import ThreeExample from './components/three'
import './App.css'

function App () {
  return (
    <Router>
      <div className='App'>
        <Switch>
          <Route exact path='/'>
            <ThreeExample />
          </Route>
        </Switch>
      </div>
    </Router>

  )
}

export default App
