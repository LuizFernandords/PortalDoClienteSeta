import axios from "axios";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import React, {useEffect, useState} from 'react';
import DataTable from 'react-data-table-component';
import {FiMoreHorizontal, FiArrowRight, FiSearch} from 'react-icons/fi'
import {CSVLink} from 'react-csv';
import './styles.css'

const Faturas = () => {
    const [faturas, setFaturas] = useState([]);
    const [selectedFatura, setSelectedFatura] = useState({});
    const [show, setShow] = useState(false);
    const [search, setSearch] = useState("");
    const [filtrofatura, setFiltroFatura] = useState([]);
    const valorTotal = faturas.reduce((accumulator, currentValue) => parseFloat(accumulator) + parseFloat(currentValue.valor), 0)
    const jurostotal = faturas.reduce((accumulator, currentValue) => parseFloat(accumulator) + parseFloat(currentValue.juros), 0)

    const handleClose = () => {
        setShow(false);
        setSelectedFatura({});
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

    function handleShow(venda) { 
        setSelectedFatura(venda);
        setShow(true); 
    }

    const getFaturas = async () =>{
        try {
            const response = await axios.get(`http://localhost:3000/getFaturasByCliente/${localStorage.getItem("token").replace(/"/g, '')}`)
            setFaturas(response.data)
            setFiltroFatura(response.data)
        }catch (error){
            console.log(error);
        }
    };
    const columns = [
        {
            name: "Valor",
            sortable: true,
            selector: (row) => formatamoeda(parseFloat(row.valor)),
        },
        {
            name: "Vencimento",
            sortable: true,
            selector: (row) => row.vencimento,
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
        getFaturas();
    },[]);
    useEffect(() => {
        const result = faturas.filter(dado =>{
          return dado.vencimento.toLowerCase().match(search.toLowerCase())
        });
        setFiltroFatura(result);
      },[search])


    return( 
    <>
    <span className="Label-titlefaturas">Faturas</span>
    <span className="Label-subtitlefaturas">Aqui você encontra as suas faturas em aberto. Utilize os filtros para navegar entre elas</span>
    <div className="TabelaFaturas">
        <DataTable
            columns={columns} 
            noDataComponent="Não existem Faturas Pendentes" 
            data={filtrofatura}
            pagination
            fixedHeader
            fixedHeaderScrollHeight="400px"
            responsive
            selectableRowsHighlight
            selectableRows
            conditionalRowStyles={stylesRow}
            subHeader
            subHeaderComponent={
              <>
              <CSVLink className="botaoExcel" data={filtrofatura} filename={"faturas.csv"}><button className="btn btn-success float-left">Exportar em Excel</button></CSVLink>    
              <span>&nbsp;&nbsp;</span><FiSearch size={25} color="#F000000"/><span>&nbsp;&nbsp;</span>
              <div class="col-sm-9">
                <input type="text" 
                class="form-control" 
                placeholder="Buscar pelo Vencimento.."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              </>
            }
            />
    </div>
    <div className='panel-totais'>
      <span className="title-total">Total: R$ {formatamoeda(valorTotal)}</span>
        <span className="title-juros">Juros/Acréscimos pelo Portal: R$ {formatamoeda(jurostotal)} 
</span>
    </div>
    <div class="buttons-pagamento">
        <button className='button-pix'><span className='caption-button'>Pix</span><span className="icon-faturas"><FiArrowRight size={16} color="#2C2C2D" /></span></button>
        <button className='button-boleto'><span className='caption-button'>Boleto</span><span className="icon-faturas"><FiArrowRight size={16} color="#2C2C2D" /></span></button>
    </div>

    <Modal show={show} onHide={handleClose} >
        <Modal.Header closeButton>
          <Modal.Title align="center">Fatura</Modal.Title>
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
        <p>Valor da Fatura: {formatamoeda(selectedFatura.valor)}</p>
        <p>Atraso em dias: {selectedFatura.atraso}</p>
        <p>Juros Pagamento pelo Portal: R$ {formatamoeda(selectedFatura.juros)}</p>
        <p>Observações:{selectedFatura.observacoes}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Fechar
          </Button>
        </Modal.Footer>
      </Modal>   
    </>);
};

export default Faturas;