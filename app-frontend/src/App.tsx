import React from 'react';
import './App.css';
import Login from './components/login';
import MainScreen from './components/mainScreen';
import {useState} from 'react';
import { Command } from '@tauri-apps/api/shell'

function App() {
  
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false)
  const [classCode, setClassCode] = useState<string>('')

  return (
    <div className="App">
      {!isLoggedIn && <Login setIsLoggedIn={setIsLoggedIn} setClassCode={setClassCode}/>}
      {isLoggedIn && <MainScreen classCode={classCode}/>}
    </div>
  );
}

export default App;
