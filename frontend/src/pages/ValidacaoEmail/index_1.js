import React, {useState, useContext} from 'react';
import './styles.css';
import Axios from "axios";
import {useNavigate} from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';
import BarraEsquerda from '../../components/BarraEsquerda';
import { IMaskInput } from "react-imask";
import StoreContext from '../../components/Store/Context'


export default function ValidacaoEmail(){
  
  const [values, setValues] = useState(initialState);
  const [errorCodigo, setErrorCodigo] = useState("");
  const {setCodigoValido} = useContext(StoreContext);
  const navigate = useNavigate();
  const url = 'http://localhost:3000/getRedefinicaoCliente/'

  function initialState(){
    return {validacodigo: ''};
  }
  
  const validacodigo = async (codigo) => {
    const response = await Axios.post(url,{
      validar: codigo.validacodigo,
      emailvalidacao: localStorage.getItem("email"),
    })
      return response
    }

  function onSubmit(event){
    event.preventDefault();
    validacodigo(values).then(
      value =>{
        console.log(value.data)
      if(value.data === 'INVALID!'){
        setErrorCodigo("Código Incorreto!")
      }else{
        setErrorCodigo("")
        setCodigoValido(value.data)
        return navigate('/NovaSenha');
      }
    })
    setValues(initialState);
  }

  function onChange(event){
    setErrorCodigo("")
    const {value, name} = event.target;
    setValues({
      ...values,
      [name]: value
    });
  }

  return(
    <>
    <BarraEsquerda></BarraEsquerda>
      <section className='panel-validaemail'>
      <span className="header-validaemail">Um e-mail foi enviado para<br/>validar sua conta</span>
      <span className='email-destino'>Email: {localStorage.getItem("email").replace(/"/g, '')}</span>
        <form className='form-validaemail' onSubmit={onSubmit}>
            <IMaskInput mask="000000" autocomplete="off" required maxLength={6} placeholder="Informe o Código Enviado"  name="validacodigo" className="input-validacodigo" onChange={onChange}/><br/>
            <span className='label-erro-validaemail'>{errorCodigo}</span>
            <button className='button-continuar-validaemail'><span className='caption-button'>Continuar</span><span className="icon-validaemail"><FiArrowRight size={16} color="#2C2C2D"/></span></button>
        </form>
    </section>
    </>
  );
}