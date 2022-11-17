import React, {useState} from 'react';
import axios from "axios";
import './styles.css'

export default function Fidelidade(){

  const [fidelidade, setFidelidade] = useState([]);

  const getFidelidade = async () =>{

    try {
        const response = await axios.get(`http://localhost:3000/getPontosFidelidadeByCliente/${localStorage.getItem("token").replace(/"/g, '')}`)
        setFidelidade(response.data)
    }catch (error){
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

  getFidelidade();

  return(
    <>
    <span className="Label-title">Pontos Fidelidade</span>
    <span className="Label-subtitle">Aqui você visualiza seus pontos acumulados, o prazo e valor disponível para utilização.</span>
    {
      fidelidade.map((fidelidade)=>
      <>
      <div className='panel-fidelidadepontos'>
      <h2 class="panel-titlefidelidadepontos">Pontos</h2>
      <h3 class="panel-textpontos">{fidelidade.pontos}</h3>
    </div>

    <div className='panel-fidelidadevalor'>
      <h2 class="panel-titlefidelidadevalor">Valor em Pontos</h2>
      <h3 class="panel-textvalorpontos">R$ {formatamoeda(parseFloat(fidelidade.valortotaldepontos))}</h3>
    </div>
     <span className="info-pontos">Cada ponto recebido vale R$ {formatamoeda(parseFloat(fidelidade.valorponto))} de desconto. Você tem até o dia<br/> {fidelidade.diamaximo} para utilizar os seus pontos. Aproveite para realizar<br/> novas compras antes que eles expirem! Esses pontos podem sofrer atualizações a qualquer momento então corra e Ganhe pontos comprando!</span>
     </>
  )
    }
   
    </>
  );
}