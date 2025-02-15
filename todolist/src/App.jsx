import { useState } from 'react'
import './App.css'
import Home from './Home.jsx';
function App() {
  const[todos,settodos] =useState([]);
  return (
    <>
    <Home/>
    </>
  )
}

export default App
