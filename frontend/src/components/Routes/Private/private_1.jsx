import React, { useContext } from "react";
import {Navigate} from 'react-router-dom';
import StoreContext from "../../Store/Context";
import Portal from '../../../pages/Portal';
import ValidacaoEmail from '../../../pages/ValidacaoEmail';
import NovaSenha from '../../../pages/NovaSenha';

const RoutesPrivate = () => {
  const { token } = useContext(StoreContext);
  const { email }= useContext(StoreContext);
  const { codigovalido } = useContext(StoreContext);

  return (
    
    // alert(token),
    // alert(email),
    // alert(codigovalido),
    token && email === null && codigovalido === null ?
      <Portal />
      : codigovalido && email && token === null ?
      <NovaSenha/>
      : email && token === null && codigovalido === null ?
      <ValidacaoEmail/>
      : <Navigate to ="/"/>
  )
}

export default RoutesPrivate;