import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from './pages/Login';
import Registro from './pages/Registro';
import CpfRedefinicao from "./pages/CpfRedefinicao";
import StoreProvider from "./components/Store/Provider";
import RoutesPrivate from "./components/Routes/Private/Private";

export default function Rotas(){
    return(
        <BrowserRouter>
         <StoreProvider>  
            <Routes>
                <Route exact path="/" element={<Login/>} />
                <Route exact path="/Registro" element={<Registro/>}/>
                <Route exact path="/CpfRedefinicao" element={<CpfRedefinicao/>}/>
                <Route exact path="/ValidacaoEmail" element={<RoutesPrivate/>}/>
                <Route exact path="/NovaSenha" element={<RoutesPrivate/>}/>
                <Route path="/Portal" element={<RoutesPrivate/>}/>
            </Routes>
           </StoreProvider> 
         </BrowserRouter>
    );
}
