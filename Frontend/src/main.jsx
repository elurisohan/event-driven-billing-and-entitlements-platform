import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Authprovider } from './context/AuthProvider.jsx'
import {QueryClient, QueryClientProvider} from '@tanstack/react-query'


const queryClient=new QueryClient({
  defaultOptions:{
    queries:{
    staleTime:1000*60*5,
    refetchOnWindowFocus: false,
  },
},
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
    <Authprovider>
    <App />
    </Authprovider>
    </QueryClientProvider>
  </StrictMode>,
)
