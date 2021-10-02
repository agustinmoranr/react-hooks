// useEffect: HTTP requests
// http://localhost:3000/isolated/exercise/06.js

import * as React from 'react'
import {
  fetchPokemon,
  PokemonForm,
  PokemonInfoFallback,
  PokemonDataView,
} from '../pokemon'
import {ErrorBoundary} from 'react-error-boundary'

const POKEMON_STATUS = {
  IDLE: 'IDLE', // no request made yet
  PENDING: 'PENDING', // request started
  RESOLVED: 'RESOLVED', // request successful
  REJECTED: 'REJECTED', // request failed
}

// class ErrorBoundary extends React.Component {
//   constructor(props) {
//     super(props)
//     this.state = {error: null}
//   }

//   static getDerivedStateFromError(error) {
//     console.log('getDerivedStateFromError', {error})
//     return {error}
//   }

//   // componentDidCatch(error, errorInfo) {
//   //   console.error({error, errorInfo})
//   // }

//   render() {
//     const {error} = this.state
//     if (error) {
//       return <this.props.FallbackComponent error={error} />
//     }

//     return this.props.children
//   }
// }

function PokemonInfo({pokemonName}) {
  const [state, setState] = React.useState({
    status: pokemonName ? POKEMON_STATUS.PENDING : POKEMON_STATUS.IDLE,
    pokemon: null,
    error: null,
  })
  const {status, pokemon, error} = state

  React.useEffect(() => {
    if (!Boolean(pokemonName)) {
      return
    }
    async function exectFetch() {
      try {
        const pokemon = await fetchPokemon(pokemonName)
        setState({status: POKEMON_STATUS.RESOLVED, pokemon, error: null})
      } catch (error) {
        setState({status: POKEMON_STATUS.REJECTED, pokemon: null, error})
      }
    }
    setState({status: POKEMON_STATUS.PENDING, pokemon: null, error: null})
    exectFetch()
  }, [pokemonName])

  if (status === POKEMON_STATUS.IDLE) {
    return 'Submit a pokemon'
  } else if (status === POKEMON_STATUS.PENDING) {
    return <PokemonInfoFallback name={pokemonName} />
  } else if (status === POKEMON_STATUS.REJECTED) {
    throw Error(error.message)
  } else if (status === POKEMON_STATUS.RESOLVED) {
    return <PokemonDataView pokemon={pokemon} />
  } else {
    throw new Error('This should be impossible to happen.')
  }
}

function FallbackComponent({error, resetErrorBoundary}) {
  return (
    <div role="alert">
      There was an error:{' '}
      <pre style={{whiteSpace: 'normal'}}>{error.message}</pre>
      <button onClick={resetErrorBoundary}>Try again my friend.</button>
    </div>
  )
}

function App() {
  const [pokemonName, setPokemonName] = React.useState('')

  function handleSubmit(newPokemonName) {
    setPokemonName(newPokemonName)
  }

  function handleBoundaryReset() {
    setPokemonName('')
  }

  return (
    <div className="pokemon-info-app">
      <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
      <hr />
      <div className="pokemon-info">
        <ErrorBoundary
          resetKeys={[pokemonName]}
          FallbackComponent={FallbackComponent}
          onReset={handleBoundaryReset}
        >
          <PokemonInfo pokemonName={pokemonName} />
        </ErrorBoundary>
      </div>
    </div>
  )
}

export default App
