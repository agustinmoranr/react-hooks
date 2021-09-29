// useRef and useEffect: DOM interaction
// 💯 (alternate) migrate from classes
// http://localhost:3000/isolated/exercise/05-classes.js

import * as React from 'react'
import VanillaTilt from 'vanilla-tilt'

// If you'd rather practice refactoring a class component to a function
// component with hooks, then go ahead and do this exercise.

//Refactor
function TiltV2({children}) {
  const tiltNodeRef = React.useRef()

  React.useEffect(() => {
    const tiltNode = tiltNodeRef.current

    const vanillaTiltOptions = {
      max: 25,
      speed: 400,
      glare: true,
      'max-glare': 0.5,
    }

    VanillaTilt.init(tiltNode, vanillaTiltOptions)

    return () => tiltNode.vanillaTilt.destroy()
  }, [])

  return (
    <div ref={tiltNodeRef} className="tilt-root">
      <div className="tilt-child">{children}</div>
    </div>
  )
}

class Tilt extends React.Component {
  tiltRef = React.createRef()
  componentDidMount() {
    const tiltNode = this.tiltRef.current
    const vanillaTiltOptions = {
      max: 25,
      speed: 400,
      glare: true,
      'max-glare': 0.5,
    }
    VanillaTilt.init(tiltNode, vanillaTiltOptions)
  }
  componentWillUnmount() {
    this.tiltRef.current.vanillaTilt.destroy()
  }
  render() {
    return (
      <div ref={this.tiltRef} className="tilt-root">
        <div className="tilt-child">{this.props.children}</div>
      </div>
    )
  }
}

function App() {
  return (
    <>
      <Tilt>
        <div className="totally-centered">Class component</div>
      </Tilt>
      <TiltV2>
        <div className="totally-centered">Function componente using Hooks</div>
      </TiltV2>
    </>
  )
}

export default App
