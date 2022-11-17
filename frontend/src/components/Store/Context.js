import { createContext } from "react";

const StoreContext = createContext({
  token: null,
  nome: null,
  email: null,
  codigovalido: null,
  setToken: () =>{

  },
  setNome: () =>{

  },
  setEmail: () =>{

  },
  setCodigoValido: () =>{
    
  }
})

export default StoreContext;