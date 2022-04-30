import { ChangeEvent, MouseEvent, useEffect, useState } from 'react'
import { Provider } from 'react-redux';
import { Route, Routes } from 'react-router-dom';
import { connect, io } from 'socket.io-client';
import './App.css'
import Home from './pages/Home';
import PollCreate from './pages/PollCreate';
import PollDisplay from './pages/PollDisplay';
import { store } from './redux/store';

function App() {

  return (
    <Provider store={store}>
      <div className="App">
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/polls'>
            <Route path=':id' element={<PollDisplay />} />
            <Route index element={<PollCreate />} />
          </Route>
        </Routes>
      </div>
    </Provider>
  )
}

export default App
