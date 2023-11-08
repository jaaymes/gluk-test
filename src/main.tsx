import { ProductProvider } from '@/context/productContext.tsx'
import '@/styles/globals.css'
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { CartProvider } from './context/cartContext.tsx'
import { UserProvider } from './context/userContext.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <UserProvider>
      <ProductProvider>
        <CartProvider>
          <App />
        </CartProvider>
      </ProductProvider>
    </UserProvider>
  </React.StrictMode>,
)
