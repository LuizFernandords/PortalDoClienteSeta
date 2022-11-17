import React, {useState} from 'react';
import { IMaskInput } from "react-imask";
import Axios from "axios";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import BarraEsquerda from '../../components/BarraEsquerda';
import {Link} from 'react-router-dom';
import { format } from 'date-fns';

import './styles.css'

export default function Cadastro(){
  let datamaxima = format(new Date(), 'yyyy-MM-dd')
  const handleClose = () => {
    setShow(false);
  };

  const handleCloseFinal = () => {
    setShowFinal(false);
  };

    const [show, setShow] = useState(false);
    const [showFinal, setShowFinal] = useState(false);
    const url = 'http://localhost:3000/createCliente/'
    const [errorSenha, setErrorSenha] = useState("");
    const [errorCpf, setErrorCpf] = useState("");
    const [sucesso, setSucesso] = useState("");
    const [data, setData] = useState({
      nome: "",
      nascimento: "",
      cpf: "",
      celular: "",
      tamanho: "",
      sexo: "",
      cep: "",
      rua: "",
      numero: "",
      bairro: "",
      cidade: "",
      uf: "",
      email: "",
      senha: "",
      senhaaux: ""
    })

    function submit(e){
      if(data.senha !== data.senhaaux){
          setErrorSenha('As Senhas não conferem!')
          e.preventDefault();
          return;
      }else{
        e.preventDefault();
        setErrorSenha('')
        Axios.post(url,{
          nome: data.nome,
          nascimento: data.nascimento,
          cpf: data.cpf,
          celular: data.celular,
          tamanho: data.tamanho,
          sexo: data.sexo,
          cep: data.cep,
          rua: data.rua,
          numero: data.numero,
          bairro: data.bairro,
          cidade: data.cidade,
          uf: data.uf,
          email: data.email,
          senha: data.senha,
        })
        .then(res=>{
          if(res.data === 'CPF'){
            setShow(true)  
            setErrorCpf('Já existe um usuário com esse CPF!')
          } else if(res.data === 'Sucesso!'){
              setShowFinal(true);
              setSucesso('Cliente cadastrado com Sucesso!')
              data.nome = ""
              data.nascimento = ""
              data.cpf  = ""
              data.celular  = ""
              data.tamanho  = ""
              data.sexo  = ""
              data.cep  = ""
              data.rua  = ""
              data.numero  = ""
              data.bairro  = ""
              data.cidade  = ""
              data.uf  = ""
              data.email  = ""
              data.senha = ""
              data.senhaaux = ""
            }
          })
        }
  }

    function handle(e){
      const newData={...data}
      newData[e.target.id] = e.target.value
      setData(newData)
    }
   
  return(
   
  <>
  <BarraEsquerda></BarraEsquerda>
    <div className='container'>
    <section className='panel-cadastro'>
      <h2 className="header-cadastro">Cadastre-se</h2>
      <span className='header-informativo'>Se cadastre e aproveite nossas ofertas! Nós entraremos<br/>em contato com você!</span>
        <form className='form-cadastro' onSubmit={(e) => submit(e)}>
        <span className='label-nascimento'>Nascimento</span>
            <IMaskInput type="text" autocomplete="off" maxLength={43} placeholder="NOME" value={data.nome} id="nome" required className="input-nome" onChange={(e)=>handle(e)}/><br/>
            <input type="date" max={datamaxima} autocomplete="off" id="nascimento" placeholder="NASCIMENTO" value={data.nascimento} required onChange={(e)=>handle(e)} className="input-nascimento"/>
            <IMaskInput autocomplete="off" mask="000.000.000-00"  id="cpf" placeholder="CPF" value={data.cpf} className="input-cpf"  onChange={(e)=>handle(e)} required/><br/>
            <IMaskInput autocomplete="off" mask="(00)00000-0000"  id="celular" placeholder="CELULAR" value={data.celular} required onChange={(e)=>handle(e)} className="input-celular"/>
            <input value={data.tamanho} autocomplete="off" mask="00" id="tamanho" required  maxLength={2} placeholder="N° PÉ" onChange={(e)=>handle(e)} className="input-calcado"/>
            <select id="sexo" onChange={(e)=>handle(e)} value={data.sexo} required placeholder='SEXO' className="input-sexo">
              <option value=""selected>SEXO</option>
              <option value="M">MASCULINO</option>
              <option value="F">FEMININO</option>
            </select>
            <IMaskInput onChange={(e)=>handle(e)} mask="00.000-000" value={data.cep} autocomplete="off" id="cep" placeholder="CEP" required className="input-cep"/><br/>
            <IMaskInput onChange={(e)=>handle(e)} autocomplete="off" value={data.rua}  id="rua" placeholder="RUA"  required className="input-rua"/>
            <IMaskInput  onChange={(e)=>handle(e)} mask="000000" autocomplete="off" value={data.numero}  id="numero" placeholder="N°" required className="input-numero"/><br/>
            <input onChange={(e)=>handle(e)} autocomplete="off"  id="bairro" placeholder="BAIRRO" value={data.bairro} required className="input-bairro"/>
            <input onChange={(e)=>handle(e)} autocomplete="off"  id="cidade" placeholder="CIDADE" value={data.cidade} required className="input-cidade"/>
            <select onChange={(e)=>handle(e)} id="uf" autocomplete="off" value={data.uf} required className="input-uf">
              <option value="">UF</option>
              <option value="AC">Acre</option>
              <option value="AL">Alagoas</option>
              <option value="AP">Amapá</option>
              <option value="AM">Amazonas</option>
              <option value="BA">Bahia</option>
              <option value="CE">Ceará</option>
              <option value="DF">Distrito Federal</option>
              <option value="ES">Espírito Santo</option>
              <option value="GO">Goiás</option>
              <option value="MA">Maranhão</option>
              <option value="MT">Mato Grosso</option>
              <option value="MS">Mato Grosso do Sul</option>
              <option value="MG">Minas Gerais</option>
              <option value="PA">Pará</option>
              <option value="PB">Paraíba</option>
              <option value="PR">Paraná</option>
              <option value="PE">Pernambuco</option>
              <option value="PI">Piauí</option>
              <option value="RJ">Rio de Janeiro</option>
              <option value="RN">Rio Grande do Norte</option>
              <option value="RS">Rio Grande do Sul</option>
              <option value="RO">Rondônia</option>
              <option value="RR">Roraima</option>
              <option value="SC">Santa Catarina</option>
              <option value="SP">São Paulo</option>
              <option value="SE">Sergipe</option>
              <option value="TO">Tocantins</option>
              <option value="EX">Estrangeiro</option>
          </select><br/>
            <input onChange={(e)=>handle(e)} autocomplete="off" type="email" value={data.email} required id="email" placeholder="E-MAIL" className="input-email"/><br/>
            <input onChange={(e)=>handle(e)} autocomplete="off" type="password" value={data.senha} maxLength={20} required id="senha" placeholder="SENHA" className="input-senha1"/><br/>
            <input onChange={(e)=>handle(e)} autocomplete="off" type="password" value={data.senhaaux} maxLength={20} required id="senhaaux" placeholder="CONFIRME A SENHA" className="input-senha2"/><br/>
            <label className='label-error-senha1'>{errorSenha}</label>
            <label className='label-error-senha2'>{errorSenha}</label>
            <button type="submit" className='button-finalizar'><span className='caption-buttonfinalizar'>Finalizar</span></button>
        </form>
    </section>
    </div>
    <Modal show={show} onHide={handleClose} dialogClassName="custom-modal-style">
        <Modal.Header closeButton>
        </Modal.Header>
        <Modal.Body>
          {errorCpf}
    </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Fechar
          </Button>
        </Modal.Footer>
      </Modal>


      <Modal show={showFinal} onHide={handleCloseFinal} dialogClassName="custom-modal-style">
        <Modal.Header closeButton>
        </Modal.Header>
        <Modal.Body>
          {sucesso}
    </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseFinal}>
            <Link to="/" className="link-registro">Voltar para página de Login</Link>
          </Button>
        </Modal.Footer>
      </Modal>

    </>

  );
}
