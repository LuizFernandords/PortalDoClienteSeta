import React from "react";
import Context from './Context';
import useStorage from '../utils/useStorage';

const StoreProvider = ({children}) =>{

  const [token, setToken] = useStorage('token');
  const [nome, setNome] = useStorage('nome');
  const [email, setEmail] = useStorage('email');
  const [codigovalido, setCodigoValido] = useStorage('codigovalido');

  return(
      <Context.Provider
      value={{
        token,
        setToken,
        nome,
        setNome,
        email,
        setEmail,
        codigovalido,
        setCodigoValido
      }}
      >
        {children}
      </Context.Provider>
  )
}

export default StoreProvider;