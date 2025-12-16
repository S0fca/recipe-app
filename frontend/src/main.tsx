import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/index.css'
import App from './App.tsx'
import {Snowfall} from "react-snowfall";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <Snowfall
          snowflakeCount={250}
          color={'#ffffff'}
          speed={[1, 3]}
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
