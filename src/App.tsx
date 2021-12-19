import React, { useEffect, useRef, useState } from 'react';
import './App.css';
import { concat, concatMap, delay, map, merge, mergeMap, Observable, Subscription, switchMap, take, timer } from 'rxjs';
import MapsComponent from './maps';
import ShareComponent from './share';

function App() {
  const [selectedPage, setSelectedPage] = useState(0);

  return (
    <div>
      <div style={{ display: 'flex' }}>
        <button onClick={() => setSelectedPage(0)}>Map operators</button>
        <button onClick={() => setSelectedPage(1)}>Share operators</button>
      </div>
      {
        selectedPage === 0 && <MapsComponent />
      }
      {
        selectedPage === 1 && <ShareComponent />
      }
    </div>
  );
}

export default App;
