import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import Civ from './Civ';

function App() {
  const [date, setDate] = useState(3456);
  useEffect(() => {
      const interval = setInterval(() => {
        setDate((prev) => prev + 1);
      }, 1000);
      return () => clearInterval(interval);
  }, []);

  return (
    <div className='App'>
      <title>Civ Game</title>
      <header>
        <h3>Stardate {date}</h3>
      </header>
      <Civ date={date}></Civ>
    </div>
  );
}

export default App;
