import axios from "axios";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import React, {useEffect, useState} from 'react';
import DataTable from 'react-data-table-component';
import {FiMoreHorizontal, FiArrowRight, FiSearch} from 'react-icons/fi'
import {CSVLink} from 'react-csv';
import './styles.css'


const Financeiro = () => {
    const [faturas, setFaturas] = useState([]);
    const [faturasAcrescimos, setFaturasAcresimos] = useState([]);
    const [selectedFatura, setSelectedFatura] = useState({});
    const [show, setShow] = useState(false);
    const [search, setSearch] = useState("");
    const [filtrofatura, setFiltroFatura] = useState([]);
    const [faturasDescontos, setFaturasDescontos] = useState([]);
    const valorTotal = faturas.reduce((accumulator, currentValue) => parseFloat(accumulator) + parseFloat(currentValue.valor), 0)

    const handleClose = () => {
        setShow(false);
        setSelectedFatura({});
    };

    function handleShow(venda) { 
        setSelectedFatura(venda);
        setShow(true); 
    }

    const getFinanceiro = async () =>{
        try {
            const response = await axios.get(`http://localhost:3000/getFinanceiroByCliente/${localStorage.getItem("token").replace(/"/g, '')}`)
            setFaturas(response.data)
            setFiltroFatura(response.data)
        }catch (error){
            console.log(error);
        }
    };

    const getFinanceiroAcresimos = async () =>{
        try {
            const response = await axios.get(`http://localhost:3000/getAcrescimosFinanceiroByCliente/${localStorage.getItem("token").replace(/"/g, '')}`)
            setFaturasAcresimos(response.data)
        }catch (error){
            console.log(error);
        }
    };

    const getFinanceiroDescontos = async () =>{
        try {
            const response = await axios.get(`http://localhost:3000/getDescontosFinanceiroByCliente/${localStorage.getItem("token").replace(/"/g, '')}`)
            setFaturasDescontos(response.data)
        }catch (error){
            console.log(error);
        }
    };
    const columns = [
        {
            name: "Valor",
            sortable: true,
            selector: (row) => row.valor,
        },
        {
            name: "Pagamento",
            sortable: true,
            selector: (row) => row.pagamento,
        },
        {
            name: "Parcela",
            sortable: true,
            selector: (row) => row.parcela,
        },
        {
            name: "Atraso",
            sortable: true,
            selector: (row) => row.atraso,
            conditionalCellStyles:[
                {
                    when: row => row.atraso > 0,
                    style:{
                        color: "red"
                    }
                }
            ]
        },
        { 
            cell : row => <button className="btn btn-light"  data-toggle="tooltip" title="Ver detalhes"
            onClick={() => handleShow(row)}>
                    <FiMoreHorizontal size={15} color="#F000000"/>
                </button>

        }
    ];


    const stylesRow = [
        {
          when: row => row.name !== '',
          style: {
            backgroundColor: '#F9F9F9'
          },
        },
      ];

    useEffect(() =>{
        getFinanceiro();
        getFinanceiroAcresimos();
        getFinanceiroDescontos();
    },[]);
    useEffect(() => {
        const result = faturas.filter(dado =>{
          return dado.pagamento.toLowerCase().match(search.toLowerCase())
        });
        setFiltroFatura(result);
      },[search])


    return( 
    <>
    <span className="Label-title">Hist??rico Financeiro</span>
    <span className="Label-subtitle">Aqui voc?? encontra o seu hist??rico financeiro, com os valores pagos referente as suas faturas.</span>
    <div className="TabelaFaturas">
        <DataTable
            columns={columns} 
            noDataComponent="N??o existem Faturas Pendentes" 
            data={filtrofatura}
            pagination
            fixedHeader
            fixedHeaderScrollHeight="400px"
            responsive
            selectableRowsHighlight
            conditionalRowStyles={stylesRow}
            subHeader
            subHeaderComponent={
              <>
              <CSVLink className="botaoExcel" data={filtrofatura} filename={"faturas.csv"}><button className="btn btn-success float-left">Exportar em Excel</button></CSVLink>    
              <span>&nbsp;&nbsp;&nbsp;</span><FiSearch size={25} color="#F000000"/><span>&nbsp;&nbsp;</span>
              <div class="col-sm-9">
                <input type="text" 
                class="form-control" 
                placeholder="Buscar pelo Pagamento.."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              </>
            }
            />
    </div>
    <div className='panel-totaisFinanceiro'>
      <span className="title-total">Total: R$ {valorTotal.toLocaleString('pt-BR', {
        currency: 'BRL',
        minimumFractionDigits: 2
      })}
    </span>
      {
        faturasAcrescimos.map((ac)=>
          <span className="title-juros">Juros/Acr??scimos: R$ {parseFloat(ac.acrescimo).toLocaleString('pt-BR', {
            currency: 'BRL',
            minimumFractionDigits: 2
          })} </span>
    )
      }
    {
        faturasDescontos.map((dd)=>
        <span className="title-juros">Descontos: R$ {parseFloat(dd.desconto).toLocaleString('pt-BR', {
          currency: 'BRL',
          minimumFractionDigits: 2
        })} </span>
    )
      }
      
    </div>

    <Modal show={show} onHide={handleClose} >
        <Modal.Header closeButton>
          <Modal.Title align="center">Baixa de T??tulo</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <p>Nome do cliente: {selectedFatura.nomecliente}</p>
        <p>Loja: {selectedFatura.codigoempresa} - {selectedFatura.nomeempresa}</p>
        <p>Venda de origem: {selectedFatura.venda}</p>
        <p>Data da venda: {selectedFatura.lancamento}</p>
        <p>Tipo da Fatura: {selectedFatura.tipo}</p>
        <p>Parcela: {selectedFatura.parcela}</p>
        <p>Documento: {selectedFatura.documento}</p>
        <p>Vencimento: {selectedFatura.vencimento}</p>
        <p>Pagamento: {selectedFatura.pagamento}</p>
        <p>Valor da Fatura: {selectedFatura.valor}</p>
        <p>Observa????es:{selectedFatura.observacoes}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Fechar
          </Button>
        </Modal.Footer>
      </Modal>   
    </>);
};

export default Financeiro;