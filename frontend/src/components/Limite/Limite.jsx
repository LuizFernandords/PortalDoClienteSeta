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
        <h3 class="panel-texttotal">R$ {parseFloat(limite.limitetotal).toLocaleString('pt-BR', {
        currency: 'BRL',
        minimumFractionDigits: 2
        })}</h3>
      </div>

      <div className='panel-limiteutilizado'>
        <h2 class="panel-titleutilizado">Limite utilizado</h2>
        <h3 class="panel-textutilizado">R$ {parseFloat(limite.limiteutilizado).toLocaleString('pt-BR', {
        currency: 'BRL',
        minimumFractionDigits: 2
      })}</h3>
      </div>

      <div className='panel-limitedisponivel'>
        <h2 class="panel-titledisponivel">Limite disponível</h2>
        <h3 class="panel-textdisponivel">R$ {parseFloat(limite.limitedisponivel).toLocaleString('pt-BR', {
        currency: 'BRL',
        minimumFractionDigits: 2
      })}</h3>
      </div>
   </>
  )
    }
    </>
  );
}