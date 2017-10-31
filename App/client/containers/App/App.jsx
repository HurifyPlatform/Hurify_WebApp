import React from 'react'
import Header from './../../components/Header/Header'
import styles from './App.css'

const App = (props) => {
  return (
    <div>
      {props.children}
    </div>
  )
}
export default App