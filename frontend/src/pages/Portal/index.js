import React, {useState, useEffect, useContext} from 'react';
import './styles.css';
import Compras from '../../components/Compras/Compras';
import Faturas from '../../components/Faturas/Faturas';
import Fidelidade from '../../components/Fidelidade/Fidelidade';
import Financeiro from '../../components/Financeiro/Financeiro';
import Limite from '../../components/Limite/Limite';
import Button from 'react-bootstrap/Button';
import {useNavigate} from 'react-router-dom';
import Modal from 'react-bootstrap/Modal';
import StoreContext from '../../components/Store/Context'


import {FiCreditCard, FiDollarSign, FiList, FiAward, FiShoppingCart, FiLogOut} from 'react-icons/fi'

export default function Portal(){

  const navigate = useNavigate();
  const [exibirCompras, setExibirCompras] = useState(false)
  const [exibirFaturas, setExibirFaturas] = useState(false)
  const [exibirFidelidade, setExibirFidelidade] = useState(false)
  const [exibirFinanceiro, setExibirFinanceiro] = useState(false)
  const [exibirLimite, setExibirLimite] = useState(false)
  const [nomeLogado, setNomeLogado] = useState("");
  const {setToken} = useContext(StoreContext);
  const {setNome} = useContext(StoreContext);
  const [show, setShow] = useState(false);

  function handleOpen(){
    setShow(true);
  }

  function Load(){
    setNomeLogado(localStorage.getItem("nome").replace(/"/g, ''))
  }
  useEffect(() => Load())

  function handleClose(){
    setShow(false);
  }

  function deslogar(){
    setToken(null)
    setNome(null)
    setShow(false);
    return navigate('/');
   }

  function renderCompras(){
    setExibirCompras(true)
    setExibirFaturas(false)
    setExibirFidelidade(false)
    setExibirFinanceiro(false)
    setExibirLimite(false)
  }

  
  function renderFaturas(){
    setExibirCompras(false)
    setExibirFaturas(true)
    setExibirFidelidade(false)
    setExibirFinanceiro(false)
    setExibirLimite(false)
  }

  function renderFidelidade(){
    setExibirCompras(false)
    setExibirFaturas(false)
    setExibirFidelidade(true)
    setExibirFinanceiro(false)
    setExibirLimite(false)
  }

  
  function renderFinanceiro(){
    setExibirCompras(false)
    setExibirFaturas(false)
    setExibirFidelidade(false)
    setExibirFinanceiro(true)
    setExibirLimite(false)
  }

  
  function renderLimite(){
    setExibirCompras(false)
    setExibirFaturas(false)
    setExibirFidelidade(false)
    setExibirFinanceiro(false)
    setExibirLimite(true)
  }
  
  return(
    <>
      <div className='panel-esquerdo-menu'>
      <div className='img-portal'></div>
      <span class="portal-bemvindo">Olá {nomeLogado}<br/>Seja Bem-Vindo(a)!</span>
        <ul class="lista-menu">
          <li className='item'><button onClick={() => renderFaturas()}  class="button-menu"><FiCreditCard  color="#F3B106" size={36} /><span className='option-menu'>&nbsp;&nbsp;Faturas</span></button></li>
          <li className='item'><button onClick={() => renderLimite()} class="button-menu"><FiDollarSign size={36} color="#F3B106"/><span className='option-menu'> &nbsp;&nbsp;Consultar Limite</span></button></li>
          <li className='item'><button onClick={() => renderCompras()} class="button-menu"><FiShoppingCart size={36} color="#F3B106"/><span className='option-menu'>&nbsp;&nbsp;Histórico de Compras</span></button></li>
          <li className='item'><button onClick={() => renderFinanceiro()} class="button-menu"><FiList size={36} color="#F3B106"/><span className='option-menu'>&nbsp;&nbsp;Histórico Financeiro</span></button></li>
          <li className='item'><button onClick={() => renderFidelidade()}  class="button-menu"><FiAward size={36} color="#F3B106"/><span className='option-menu'>&nbsp;&nbsp;Pontos Fidelidade</span></button></li>
          <li className='item'><button class="button-menu" onClick={() => handleOpen()}><FiLogOut size={36} color="#F3B106"/>&nbsp;&nbsp;<span className='option-menu'>Sair</span></button></li>
        </ul>
    </div>
    <div>

      {exibirCompras === true && <Compras/>}
      {exibirFaturas === true && <Faturas/>}
      {exibirFidelidade === true && <Fidelidade/>}
      {exibirFinanceiro === true && <Financeiro/>}
      {exibirLimite === true && <Limite/>}
      
    </div>

      
    <Modal show={show} onHide={handleClose} dialogClassName="custom-modal-style">
        <Modal.Header closeButton>
        </Modal.Header>
        <Modal.Body>
          <h5>Deseja realmente Sair do Portal?</h5>
      </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => deslogar()}>
            Sim
          </Button>
          <Button variant="secondary" onClick={() => handleClose()}>
            Não
          </Button>
        </Modal.Footer>
      </Modal> 
 
    </>
  );
}