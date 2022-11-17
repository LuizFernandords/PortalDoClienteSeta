import React, {useState, useContext} from 'react';
import './styles.css';
import Axios from "axios";
import {useNavigate} from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';
import BarraEsquerda from '../../components/BarraEsquerda';
import { IMaskInput } from "react-imask";
import StoreContext from '../../components/Store/Context'


export default function CpfRedefinicao(){
  
  const [values, setValues] = useState(initialState);
  const [errorCpf, setErrorCpf] = useState("");
  const {setEmail} = useContext(StoreContext);
  const navigate = useNavigate();
  const url = 'http://localhost:3000/getRedefinicaoCliente/'

  function initialState(){
    return {cpfredefinicao:''};
  }
  
  const redefinicao = async (dadosredefinicao) => {
    const response = await Axios.post(url,{
        cpf: dadosredefinicao.cpfredefinicao
      })
      return response
   }

  function onSubmit(event){
    event.preventDefault();
    redefinicao(values).then(
      value =>{
      if(value.data === 'INVALID!'){
       setErrorCpf("Cpf Inexistente!")
      }else{
        setErrorCpf("")
        setEmail(value.data.email)
        localStorage.setItem('cpf', value.data.cpf)

        const enviaemail = async () => {
          const response = await Axios.post(url,{
            email: localStorage.getItem("email")
          })
          return response
        }
        enviaemail();
        return navigate('/ValidacaoEmail');
      }
    })
    //setValues(initialState);
  }

  function onChange(event){
    setErrorCpf("")
    const {value, name} = event.target;
    setValues({
      ...values,
      [name]: value
    });
  }

  return(
    <>
    <BarraEsquerda></BarraEsquerda>
      <section className='panel-redefinicao'>
      <h2 className="header-redefinicao">Informe seu CPF</h2>
        <form className='form-redefinicao' onSubmit={onSubmit}>
            <IMaskInput mask="000.000.000-00" autocomplete="off" required maxLength={14} placeholder="Digite seu Cpf"  name="cpfredefinicao" className="input-cpfredefinicao" onChange={onChange}/><br/>
            <span className='label-erro-redefinicao'>{errorCpf}</span>
             <button type="submit" className='button-continuar'><span className='caption-button'>Continuar</span><span className="icon-login"><FiArrowRight size={16} color="#2C2C2D" /></span></button>
        </form>
    </section>
    </>
  );
}