import React from 'react'
import {BrowserRouter, Routes, Route} from "react-router-dom"
import Acceuil from "./Acceuil"

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Acceuil/>}/>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
