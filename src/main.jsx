import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import {App} from './App.jsx'
import {BrowserRouter} from "react-router-dom";
import {ToastContainer} from "react-toastify";
import './components/sale/Ticket.css';

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <BrowserRouter>
            <App/>
            <ToastContainer/>
        </BrowserRouter>
    </StrictMode>,
)
