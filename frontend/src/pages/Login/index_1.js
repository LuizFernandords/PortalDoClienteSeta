import React, {useState, useContext, useEffect} from 'react';
import './styles.css';
import Axios from "axios";
import {useNavigate} from 'react-router-dom';
import {Link} from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';
import StoreContext from '../../components/Store/Context'
import BarraEsquerda from '../../components/BarraEsquerda';
import { IMaskInput } from "react-imask";


export default function ComponentLogin(){
  
  const [values, setValues] = useState(initialState);
  const [errorLogin, setErrorLogin] = useState("");
  const {setToken} = useContext(StoreContext);
  const {setNome} = useContext(StoreContext);
  const navigate = useNavigate();
  const url = 'http://localhost:3000/getUserCliente/'

  function initialState(){
    return {cpflogin: '', senhalogin: ''};
  }
  function resetaredefinicao(){
    localStorage.removeItem("email");
    localStorage.removeItem("codigovalido");
    localStorage.removeItem("cpf");
  }

  const login = async (dadoslogin) => {
   const response = await Axios.post(url,{
        cpf: dadoslogin.cpflogin,
        senha: dadoslogin.senhalogin
      })
      return response
   }

  function onSubmit(event){
    event.preventDefault();
    login(values).then(
      value =>{
      if(value.data === 'INVALID'){
        setErrorLogin("Usuário ou Senha inválidos!")
      }else{
        setErrorLogin("")
        setToken(value.data.token)
        setNome(value.data.nome)
        return navigate('/Portal');
      }
    })
    setValues(initialState);
  }

  function onChange(event){
    setErrorLogin("")
    const {value, name} = event.target;
    setValues({
      ...values,
      [name]: value
    });
  }

  useEffect(() => resetaredefinicao())
  return(
    <>
    <BarraEsquerda></BarraEsquerda>
      <section className='panel-login'>
      <div className='img-loja'>
      </div>
      <h2 className="header-login">Entrar</h2>
        <form className='form-login' onSubmit={onSubmit}>
            <IMaskInput mask="000.000.000-00" autocomplete="off" required maxLength={14} placeholder="Digite seu Cpf"  name="cpflogin" className="input-cpflogin" value={values.cpflogin} onChange={onChange}/><br/>
            <span className='label-erro-login1'>{errorLogin}</span>
            <input autocomplete="off" type="password"  required name="senhalogin" placeholder="Digite sua Senha" onChange={onChange} value={values.senhalogin} className="input-senha"/><br/>
            <span className='label-erro-login2'>{errorLogin}</span>
             <button type="submit" className='button-continuar'><span className='caption-button'>Continuar</span><span className="icon-login"><FiArrowRight size={16} color="#2C2C2D" /></span></button>
             <div className='links-login'>
             <button className='label-cadastroLogin'><Link to="Registro" className='link'>Não é nosso Cliente?</Link></button><br/>
             <button className='label-senhaLogin'><Link to="CpfRedefinicao" className='link'>Esqueceu a Senha?</Link></button><br/>
              </div>
        </form>
    </section>
    </>
  );
}