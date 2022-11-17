const express=require('express')
const bodyparser=require('body-parser')
const cors = require('cors')

const app=express()

const db=require('./query')

app.use(bodyparser.json())

app.use(bodyparser.urlencoded({extended:false}))
app.use(cors());
app.post('/createCliente',db.createCliente)
app.get('/getAllCompras/:id',db.getCompraByCliente)
app.get('/getProdutosByVenda/:id',db.getProdutosByVenda)
app.get('/getFormasPagamentoByVenda/:id',db.getFormasPagamentoByVenda)
app.get('/getPontosFidelidadeByCliente/:id',db.getPontosFidelidadeByCliente)
app.get('/getFaturasByCliente/:id',db.getFaturasByCliente)
app.get('/getFinanceiroByCliente/:id',db.getFinanceiroByCliente)
app.get('/getLimiteByCliente/:id',db.getLimiteByCliente)
app.post('/getRedefinicaoCliente/',db.getRedefinicaoCliente)
app.get('/getAcrescimosFinanceiroByCliente/:id',db.getAcrescimosFinanceiroByCliente)
app.get('/getDescontosFinanceiroByCliente/:id',db.getDescontosFinanceiroByCliente)
app.post('/getUserCliente',db.getUserCliente)
// app.get('/getAllCompras',db.getAllCompras)
// app.delete('/deleteUser/:id',db.deleteUser)
// app.put('/updateUser/:id',db.updateUser)

app.listen(3000,() => console.log('listening to the port 3000 ...'))