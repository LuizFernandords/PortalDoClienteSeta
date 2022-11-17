import axios from "axios";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import React, {useEffect, useState} from 'react';
import DataTable from 'react-data-table-component';
import {FiMoreHorizontal, FiSearch} from 'react-icons/fi';
import {CSVLink} from 'react-csv';
import './styles.css';

const Compras = () => {
    const [compras, setCompras] = useState([]);
    const [show, setShow] = useState(false);
    const [selectedRow, setSelectedRow] = useState({});
    const [selectedProdutos, setProdutos] = useState([]);
    const [selectedFinanceiro, setFinanceiro] = useState([]);
    const [search, setSearch] = useState("");
    const valorTotal = compras.reduce((accumulator, currentValue) => parseFloat(accumulator) + parseFloat(currentValue.total), 0)
    const [filtroVenda, setFiltroVenda] = useState([]);

    const handleClose = () => {
      setShow(false);
      setSelectedRow({});
    };
    
    function handleShow(venda) { 
      setSelectedRow(venda); 
      axios.get(`http://localhost:3000/getProdutosByVenda/VE${venda.venda}`)
      .then(response =>{
        setProdutos(response.data);
        
          axios.get(`http://localhost:3000/getFormasPagamentoByVenda/${venda.venda}`)
          .then(responseFinanceiro =>{
            console.log(responseFinanceiro.data);
            setFinanceiro(responseFinanceiro.data);
            setShow(true);
          })
          .catch(error => {
            console.log(error);
          })
          setShow(true);
      })
      .catch(error => {
        console.log(error);
      })
    }


    const getCompras = async () =>{
        try {
            const response = await axios.get(`http://localhost:3000/getAllCompras/${localStorage.getItem("token").replace(/"/g, '')}`)
            setCompras(response.data)
            setFiltroVenda(response.data)
        }catch(error){
            console.log(error);
        }
    };
    const columns = [
        {
            name: "Condição",
            sortable: true,
            selector: (row) => row.condicao,
        },
        {
            name: "Data",
            sortable: true,
            selector: (row) => row.data,
        },
        {
            name: "Hora",
            sortable: true,
            selector: (row) => row.hora,
        },
        {
            name: "Itens",
            sortable: true,
            selector: (row) => row.itens,
        },
        {
            name: "Total",
            sortable: true,
            selector: (row) => parseFloat(row.total).toLocaleString('pt-BR', {
              currency: 'BRL',
              minimumFractionDigits: 2
            }),
            conditionalCellStyles:[
                {
                    when: row => row.vendedor === "Luiz",
                    style:{
                        color: "red"
                    }
                }
            ]
        },
        { 
          
            cell : row =><> <button className="btn btn-light" onClick={() => handleShow(row)} data-toggle="tooltip" title="Consultar detalhamento da compra">
                    <FiMoreHorizontal size={15} color="#F000000"/>
                </button>
               
                </>
        }
    ];


    const stylesRow = [
        {
          when: row => row.venda !== '',
          style: {
            backgroundColor: '#F9F9F9'
          },
        },
      ];

    useEffect(() =>{
        getCompras();
    },[]);
    useEffect(() => {
      const result = compras.filter(dado =>{
        return dado.data.toLowerCase().match(search.toLowerCase())
      });
      setFiltroVenda(result);
    },[search])

    return( 
    <>
    <span className="Label-title">Histórico de Compras</span>
    <span className="Label-subtitle">Aqui você encontra as suas compras realizadas. Clique nos três pontinhos para visualizar o detalhamento.</span>
    
    <div className="TabelaFaturas">
        <DataTable
            columns={columns} 
            noDataComponent="Não existem Compras realizadas" 
            data={filtroVenda}
            pagination
            fixedHeader
            fixedHeaderScrollHeight="100%"
            responsive
            selectableRowsHighlight
            conditionalRowStyles={stylesRow}
            subHeader
            subHeaderComponent={
              <>
              <CSVLink className="botaoExcel" data={filtroVenda} filename={"compras.csv"}><button className="btn btn-success float-left">Exportar em Excel</button></CSVLink>    
              <span>&nbsp;&nbsp;</span><FiSearch size={25} color="#F000000"/><span>&nbsp;&nbsp;</span>
              <div class="col-sm-9">
                <input type="text" 
                class="form-control" 
                placeholder="Buscar pela Data.."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              </>
            }
            />
    </div>
    
    <div className='panel-totaisCompras'>
    <span className="title-totalCompras">Total: R$ {valorTotal.toLocaleString('pt-BR', {
     currency: 'BRL',
     minimumFractionDigits: 2})}
     </span>
    </div>
 
    <Modal show={show} onHide={handleClose} dialogClassName="custom-modal-style">
        <Modal.Header closeButton>
          <Modal.Title align="center">Venda Nº: {selectedRow.venda}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <p>Data e hora: {selectedRow.data} {selectedRow.hora}</p>
        <p>Cliente: {selectedRow.clientecodigo} - {selectedRow.cliente}</p>
        <p>Vendedor: {selectedRow.vendedorcodigo} - {selectedRow.vendedor}</p>
        <p>Loja: {selectedRow.empresacodigo} - {selectedRow.empresa}</p>
        <br/>
        <h5 align="center">Produtos</h5>
        <table class="table">
          <thead>
            <tr>
              <th scope="col">Código</th>
              <th scope="col">Tamanho</th>
              <th scope="col">Nome</th>
              <th scope="col">Qtde</th>
              <th scope="col">Unitário</th>
              <th scope="col">Desc/Acres</th>
              <th scope="col">Total</th>
            </tr>
          </thead>
            <tbody>
            {
                selectedProdutos.map((produtos)=>
                    <tr>
                      <td>{produtos.codproduto}</td>
                      <td>{produtos.tamanho}</td>
                      <td>{produtos.nomeproduto}</td>
                      <td>{produtos.qtde}</td>
                      <td>{produtos.total}</td>
                      <td>{produtos.desconto}</td>
                      <td>{produtos.unitario}</td>
                    </tr>
                )
              } 
            </tbody>
    </table>
<br/>
<h5 align="center">Totais</h5><br/>
<table class="table">
  <tr>
      <th scope="col">Total</th>
      <th scope="col">Subtotal</th>
      <th scope="col">Total Itens</th>
      <th scope="col">Total A Vista</th>
      <th scope="col">Total A Prazo</th>
  </tr>
  <tbody>
    <tr>
      <td>{selectedRow.total}</td>
      <td>{selectedRow.subtotal}</td>
      <td>{selectedRow.itens}</td>
      <td>{selectedRow.avista}</td>
      <td>{selectedRow.aprazo}</td>
    </tr>
  </tbody>
</table>
<br/>
<h5 align="center">Pagamento</h5>
<table class="table">
<thead>
    <tr>
      <th scope="col">Parcela</th>
      <th scope="col">Valor</th>
    </tr>
  </thead>
  <tbody>
    {
      selectedFinanceiro.map((financeiro)=>
      <tr>
        <td>{financeiro.parcela}</td>
        <td>{financeiro.valor}</td>
      </tr>
  )
    }
  </tbody>
</table>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Fechar
          </Button>
        </Modal.Footer>
      </Modal>
    </>
    );
};

export default Compras;