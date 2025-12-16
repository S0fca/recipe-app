import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/index.css'
import App from './App.tsx'
import {Snowfall} from "react-snowfall";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <Snowfall
          snowflakeCount={150}
          color={'#ffffff'}
          speed={[0.5, 2.5]}
          radius={[0.5, 3.5]}
          style={{
              position: "fixed",
              zIndex: 9999,
              pointerEvents: "none",
          }}
      />
    <App />
  </StrictMode>,
)
