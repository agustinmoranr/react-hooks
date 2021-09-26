// useEffect: persistent state
// http://localhost:3000/isolated/exercise/02.js

import * as React from 'react'

function handleLSExceptions(LSKey) {
  if (!LSKey || typeof LSKey !== 'string' || LSKey === null) {
    window.localStorage.removeItem(LSKey)
    console.error('Key invalido: No se añaden elementos a local storage', {
      keyValue: LSKey,
    })
    throw new Error('El valor del key no contiene un valor valido')
  }
}

function getValueFromLS(LSKey, LSDefaultValue, {deserialize}) {
  handleLSExceptions(LSKey)

  const valueInLS = window.localStorage.getItem(LSKey)

  if (valueInLS) {
    // the try/catch is here in case the localStorage value was set before
    // we had the serialization in place (like we do in previous extra credits)
    try {
      return deserialize(valueInLS)
    } catch (error) {
      window.localStorage.removeItem(LSKey)
    }
  }
  return typeof LSDefaultValue === 'function'
    ? LSDefaultValue()
    : LSDefaultValue
}

function useLocalStorageState(
  LSKey = null,
  LSDefaultValue = '',
  {serialize = JSON.stringify, deserialize = JSON.parse} = {},
) {
  const [currentValue, setCurrentValue] = React.useState(
    getValueFromLS(LSKey, LSDefaultValue, {deserialize}),
  )

  const prevKeyRef = React.useRef(LSKey)

  React.useEffect(() => {
    handleLSExceptions(LSKey)
    const prevKey = prevKeyRef.current

    if (prevKey !== LSKey) {
      window.localStorage.removeItem(prevKey)
    }
    prevKeyRef.current = LSKey

    const valueToStore = serialize(currentValue)
    window.localStorage.setItem(LSKey, valueToStore)
  }, [LSKey, currentValue, serialize])

  return [currentValue, setCurrentValue]
}

function Greeting({initialName = ''}) {
  const [currentLSValue, setLSValue] = useLocalStorageState('name', initialName)

  function handleChange(event) {
    let value = event.target.value
    setLSValue(value)
  }

  return (
    <div>
      <form>
        <label htmlFor="name">Name: </label>
        <input value={currentLSValue} onChange={handleChange} id="name" />
      </form>
      {currentLSValue ? (
        <strong>Hello {currentLSValue}</strong>
      ) : (
        'Please type your name'
      )}
    </div>
  )
}

function App() {
  return <Greeting initialName="Agustin Moran" />
}

export default App
