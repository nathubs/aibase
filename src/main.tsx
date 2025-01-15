import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import App from './App.tsx';
import { BasicProvider } from './components/basic/provider.tsx';


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BasicProvider >
      <App />
    </BasicProvider>
  </StrictMode>,
)
