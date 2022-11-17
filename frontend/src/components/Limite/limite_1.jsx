import React, {useState} from 'react';
import axios from "axios";
import './styles.css'

export default function Limite(){

  const [limite, setLimite] = useState([]);

  const getLimite = async () =>{

    try {
        const response = await axios.get(`http://localhost:3000/getLimiteByCliente/${localStorage.getItem("token").replace(/"/g, '')}`)
        setLimite(response.data)
        console.log(response.data)
    }catch (error){
      console.log('oi')
        console.log(error);
    }
  };

  function formatamoeda(valor){
    let zero = 0;
    if(valor === undefined){
      return zero.toLocaleString('pt-BR', {
        currency: 'BRL',
        minimumFractionDigits: 2})
    }else{
      return valor.toLocaleString('pt-BR', {
        currency: 'BRL',
        minimumFractionDigits: 2})
    }
  }

  getLimite();

  return(
    <>
    <span className="Label-title">Consulta de Limite</span>
    <span className="Label-subtitle">Aqui você visualiza o seu limite total para realizar compras no A PRAZO CREDIÁRIO da loja!</span>
    
    {
      limite.map((limite)=>
    <>
      <div className='panel-limitetotal'>
        <h2 class="panel-titletotal">Limite total</h2>
        <h3 class="panel-texttotal">R$ {formatamoeda(parseFloat(limite.limitetotal))}</h3>
      </div>

      <div className='panel-limiteutilizado'>
        <h2 class="panel-titleutilizado">Limite utilizado</h2>
        <h3 class="panel-textutilizado">R$ {formatamoeda(parseFloat(limite.limiteutilizado))}</h3>
      </div>

      <div className='panel-limitedisponivel'>
        <h2 class="panel-titledisponivel">Limite disponível</h2>
        <h3 class="panel-textdisponivel">R$ {formatamoeda(parseFloat(limite.limitedisponivel))}</h3>
      </div>
   </>
  )
    }
    </>
  );
}