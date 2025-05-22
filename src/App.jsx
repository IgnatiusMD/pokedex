import React from 'react'
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"; 
import HomePage from './pages/HomePage';
import PokemonDetail from './pages/PokemonDetail';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<HomePage />} />
        <Route path="/pokemon/:name" element={<PokemonDetail />} />
      </Routes>
    </Router>
  )
}

export default App
