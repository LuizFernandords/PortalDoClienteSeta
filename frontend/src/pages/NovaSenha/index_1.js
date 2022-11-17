import React, {useState} from 'react';
import './styles.css';
import Axios from "axios";
import {useNavigate} from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';
import BarraEsquerda from '../../components/BarraEsquerda';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { IMaskInput } from "react-imask";

export default function NovaSenha(){
  
  const [values, setValues] = useState(initialState);
  const [showFinal, setShowFinal] = useState(false);
  const [errorSenha, setErrorSenha] = useState("");
  const navigate = useNavigate();
  const url = 'http://localhost:3000/getRedefinicaoCliente/'

  function handleCloseFinal(){
    localStorage.removeItem("email");
    localStorage.removeItem("codigovalido");
    localStorage.removeItem("cpf");
    return navigate('/');
  }

  const handleOpen = () => {
    setShowFinal(true);
  };

  function initialState(){
    return {novasenha: '', novasenhaaux: ''};
  }
  
  const updatesenha = async (senha) => {
   const response = await Axios.post(url,{
        novasenha: senha.novasenha,
        cpf: localStorage.getItem("cpf")
      })
      return response
   }

  function onSubmit(event){
    event.preventDefault();

    if(values.novasenha !== values.novasenhaaux){
      setErrorSenha("As senhas não conferem!")
    }else{
      updatesenha(values).then(
        value =>{
        if(value.data === 'INVALID'){
        }else{
          handleOpen()
        }
      })
      setValues(initialState);
   }
  }

  function onChange(event){
    setErrorSenha("")
    const {value, name} = event.target;
    setValues({
      ...values,
      [name]: value
    });
  }

  return(
    <>
    <BarraEsquerda></BarraEsquerda>
      <section className='panel-novasenha'>
      <span className="header-novasenha">Informe a<br/>Nova Senha</span>
        <form className='form-novasenha' onSubmit={onSubmit}>
            <IMaskInput autocomplete="off" type="password" required maxLength={20} placeholder="Informe a Nova Senha"  name="novasenha" className="input-novasenha" onChange={onChange}/><br/>
            <span className='label-erro-novasenha1'>{errorSenha}</span>
            <IMaskInput autocomplete="off"  type="password" required maxLength={20} placeholder="Confirme a Senha"  name="novasenhaaux" className="input-novasenhaaux" onChange={onChange}/><br/>
            <span className='label-erro-novasenha2'>{errorSenha}</span>
            <button type="submit" className='button-continuar-novasenha'><span className='caption-button'>Finalizar</span><span className="icon-novasenha"><FiArrowRight size={16} color="#2C2C2D" /></span></button>
        </form>
    </section>

    <Modal show={showFinal} onHide={handleCloseFinal} dialogClassName="custom-modal-style">
        <Modal.Header closeButton>
        </Modal.Header>
        <Modal.Body>
          <p>Senha alterada com sucesso!</p>
    </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseFinal}>
            Voltar para página de Login
          </Button>
        </Modal.Footer>
      </Modal>

    </>
  );
}