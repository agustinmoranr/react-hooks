// Hook flow
// https://github.com/donavon/hook-flow
// http://localhost:3000/isolated/examples/hook-flow.js

// PLEASE NOTE: there was a subtle change in the order of cleanup functions
// getting called in React 17:
// https://github.com/kentcdodds/react-hooks/issues/90

import * as React from 'react'

function App() {
  console.log('%cApp: render start', 'color: MediumSpringGreen')

  const [showChild, setShowChild] = React.useState(() => {
    console.log('%cApp: useState(() => false)', 'color: tomato')
    return false
  })

  React.useEffect(() => {
    console.log('%cApp: useEffect(() => {})', 'color: LightCoral')
    return () => {
      console.log('%cApp: useEffect(() => {}) cleanup 🧹', 'color: LightCoral')
    }
  })

  React.useEffect(() => {
    console.log('%cApp: useEffect(() => {}, [])', 'color: MediumTurquoise')
    return () => {
      console.log(
        '%cApp: useEffect(() => {}, []) cleanup 🧹',
        'color: MediumTurquoise',
      )
    }
  }, [])

  React.useEffect(() => {
    console.log('%cApp: useEffect(() => {}, [showChild])', 'color: HotPink')
    return () => {
      console.log(
        '%cApp: useEffect(() => {}, [showChild]) cleanup 🧹',
        'color: HotPink',
      )
    }
  }, [showChild])

  const element = (
    <>
      <label>
        <input
          type="checkbox"
          checked={showChild}
          onChange={e => setShowChild(e.target.checked)}
        />{' '}
        show child
      </label>
      <div
        style={{
          padding: 10,
          margin: 10,
          height: 50,
          width: 50,
          border: 'solid',
        }}
      >
        {showChild ? <Child /> : null}
      </div>
    </>
  )

  console.log('%cApp: render end', 'color: MediumSpringGreen')

  return element
}

function Child() {
  console.log('%c    Child: render start', 'color: MediumSpringGreen')

  const [count, setCount] = React.useState(() => {
    console.log('%c    Child: useState(() => 0)', 'color: tomato')
    return 0
  })

  React.useEffect(() => {
    console.log('%c    Child: useEffect(() => {})', 'color: LightCoral')
    return () => {
      console.log(
        '%c    Child: useEffect(() => {}) cleanup 🧹',
        'color: LightCoral',
      )
    }
  })

  React.useEffect(() => {
    console.log(
      '%c    Child: useEffect(() => {}, [])',
      'color: MediumTurquoise',
    )
    return () => {
      console.log(
        '%c    Child: useEffect(() => {}, []) cleanup 🧹',
        'color: MediumTurquoise',
      )
    }
  }, [])

  React.useEffect(() => {
    console.log('%c    Child: useEffect(() => {}, [count])', 'color: HotPink')
    return () => {
      console.log(
        '%c    Child: useEffect(() => {}, [count]) cleanup 🧹',
        'color: HotPink',
      )
    }
  }, [count])

  const element = (
    <button onClick={() => setCount(previousCount => previousCount + 1)}>
      {count}
    </button>
  )

  console.log('%c    Child: render end', 'color: MediumSpringGreen')

  return element
}

export default App

//Resultado
//Mount del componente App
// App: render start
// hook-flow.js:17 App: useState(() => false)
// hook-flow.js:17 App: render end
// hook-flow.js:17 App: useEffect(() => {})
// hook-flow.js:17 App: useEffect(() => {}, [])
// hook-flow.js:17 App: useEffect(() => {}, [showChild])
// ===================================================================

//Mount del componente Child y update del componente App
// hook-flow.js:17 App: render start
// hook-flow.js:17 App: render end
// hook-flow.js:17     Child: render start
// hook-flow.js:17     Child: useState(() => 0)
// hook-flow.js:17     Child: render end
// hook-flow.js:17 App: useEffect(() => {}) cleanup 🧹
// hook-flow.js:17 App: useEffect(() => {}, [showChild]) cleanup 🧹
// hook-flow.js:17     Child: useEffect(() => {})
// hook-flow.js:17     Child: useEffect(() => {}, [])
// hook-flow.js:17     Child: useEffect(() => {}, [count])
// hook-flow.js:17 App: useEffect(() => {})
// hook-flow.js:17 App: useEffect(() => {}, [showChild])

//update del componente Child
// ===================================================================
// hook-flow.js:17     Child: render start
// hook-flow.js:17     Child: render end
// hook-flow.js:17     Child: useEffect(() => {}) cleanup 🧹
// hook-flow.js:17     Child: useEffect(() => {}, [count]) cleanup 🧹
// hook-flow.js:17     Child: useEffect(() => {})
// hook-flow.js:17     Child: useEffect(() => {}, [count])
// ===================================================================

//update App y unmount del componente Child
// App: render start
// hook-flow.js:17 App: render end
// hook-flow.js:17     Child: useEffect(() => {}) cleanup 🧹
// hook-flow.js:17     Child: useEffect(() => {}, []) cleanup 🧹
// hook-flow.js:17     Child: useEffect(() => {}, [count]) cleanup 🧹
// hook-flow.js:17 App: useEffect(() => {}) cleanup 🧹
// hook-flow.js:17 App: useEffect(() => {}, [showChild]) cleanup 🧹
// hook-flow.js:17 App: useEffect(() => {})
// hook-flow.js:17 App: useEffect(() => {}, [showChild])

//Notas: los cleanups de un componente que se desmonta ocurren primero que los de un componente que recive un updates

//Los mount ocurren antes que los updates
