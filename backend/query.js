const { response, request } = require('express')
const res = require('express/lib/response')
const nodemailer = require('nodemailer')

const Pool=require('pg').Pool

const pool=new Pool({
    user: 'rede000025',
    host: 'srvdb05.setadigital.com.br',
    database: 'dbseta',
    password: 'seta',
    port:5434
})

// //Grava os dados recebidos pelo JSON
const createCliente = (request, response) => {
  const { nome, nascimento, cpf, celular, tamanho, sexo, rua, numero, bairro, cidade, uf, cep, email, senha} = request.body
  
  pool.query("select codigo from pessoas where cpfcnpj = trim($1)", [cpf], (error, results) => {
    if (error) {
      throw error
    }
    if(results.rowCount > 0){
      response.status(200).send('CPF')
    }else{
          pool.query('INSERT INTO pessoas (nome, nascimento, cpfcnpj, telefone2, tamanho, sexo, cep, endereco, bairro, cidade, uf, email, cliente, pessoa, status, senha) VALUES (UPPER($1), $2, $3, $4, $5, UPPER($6), $7, UPPER($8), UPPER($9), UPPER($10), UPPER($11), UPPER($12), $13, $14, $15, $16)', [nome+' -PORTAL', nascimento, cpf, celular, tamanho, sexo, cep, rua+','+numero, bairro, cidade, uf, email, 'T', '1','S', senha], (error, results) => {
            if (error) {
              throw error
            }
          response.status(200).send('Sucesso!')
      })
    }
  })
}

const getPontosFidelidadeByCliente = (request, response) => {
  
  const id = request.params.id;

  pool.query("with cgd as( select row_number() OVER (PARTITION by 0) as _seq, valordoponto, diasexpirapontos::Numeric(4) as diasexpirar, diascarenciapontos::Numeric(4) as diascomecar from configfidelidade where codigo = '01' ), ctd as(select row_number() OVER (PARTITION by 0) as _seq, pontos, data from cartao_fidelidade where pessoa = $1) select  Sum(ctd.pontos) as pontos, cgd.valordoponto as valorponto, To_Char((Max(ctd.data) + interval '1 day' *cgd.diasexpirar)::Date, 'DD/MM/YYYY')  as diamaximo, Sum(ctd.pontos)* cgd.valordoponto as valortotaldepontos from ctd inner join cgd on ctd._seq = cgd._seq where current_date >= (ctd.data + interval '1 day' * cgd.diascomecar) and current_date <= (ctd.data +interval '1 day' * cgd.diasexpirar) group by cgd.valordoponto, cgd.diasexpirar", [id], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const getLimiteByCliente = (request, response) => {
  
  const id = request.params.id;
  pool.query("select limitetotal, limiteutilizado, limitedisponivel from vlimiteportal where pessoa = $1", [id], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}



const getUserCliente = (request, response) => {

  //const {cpf, senha} = request.body
  
  let cpf = request.body.cpf
  let senha = request.body.senha
  
  pool.query("select trim(codigo) as token, INITCAP(Trim(SUBSTRING(nome,1,position(' ' in nome)))) as nome, email from pessoas where cpfcnpj = '"+cpf+"' and senha = '"+senha+"'", (error, results) => {
    if (error) {
      throw error
    }
    if(results.rowCount === 0){
      response.status(200).send('INVALID')
    }else{
      response.status(200).send(...results.rows)
    }
  })
}

const getFaturasByCliente = (request, response) => {
  
  const id = request.params.id;

  pool.query("select trim(nomecliente) as nomecliente, codigoempresa, nomeempresa, valor, valorpago, venda, tipo, TO_CHAR(vencimento, 'DD/MM/YYYY') as vencimento, trim(parcela) as parcela, documento, trim(observacoes) as observacoes, TO_CHAR(lancamento, 'DD/MM/YYYY') as lancamento, case when atraso < 0 then 0 else atraso end as atraso, coalesce(juros,0) as juros from vfaturasportal where codigocliente = $1 order by vencimento::Date asc", [id], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const getAcrescimosFinanceiroByCliente = (request, response) => {
  
  const id = request.params.id;

  pool.query("select coalesce(SUM(valor),0) as acrescimo from vhistoricofinanceiroportal where parcela like '%A%' and codigocliente = $1 ", [id], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const getDescontosFinanceiroByCliente = (request, response) => {
  
  const id = request.params.id;

  pool.query("select coalesce(SUM(valor),0) as desconto from vhistoricofinanceiroportal where parcela like '%D%' and codigocliente = $1 ", [id], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const getFinanceiroByCliente = (request, response) => {
  
  const id = request.params.id;

  pool.query("select trim(nomecliente) as nomecliente, codigoempresa, nomeempresa, valor, valorpago, venda, tipo, TO_CHAR(vencimento, 'DD/MM/YYYY') as vencimento, TO_CHAR(pagamento, 'DD/MM/YYYY') as pagamento, trim(parcela) as parcela, documento, trim(observacoes) as observacoes, TO_CHAR(lancamento, 'DD/MM/YYYY') as lancamento, case when atraso < 0 then 0 else atraso end as atraso from vhistoricofinanceiroportal where codigocliente = $1 order by vencimento::Date asc", [id], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

//Seleciona os dados pelo ID
const getCompraByCliente = (request, response) => {
  
  const id = request.params.id;

  pool.query('SELECT venda, clientecodigo, trim(cliente) as cliente, vendedorcodigo, trim(vendedor) as vendedor, trim(condicao) as condicao, data, hora, itens, total, subtotal, empresacodigo, trim(empresa) as empresa, avista, aprazo from vvendasportal WHERE clientecodigo = $1', [id], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const getProdutosByVenda = (request, response) => {
  const id = request.params.id;
  pool.query('SELECT codproduto, tamanho, trim(nomeproduto) as nomeproduto, unitario, total, desconto, qtde, subtotal, auxiliar from vmovimentoportal WHERE auxiliar = $1', [id], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const getFormasPagamentoByVenda = (request, response) =>{
  const venda = request.params.id;
  pool.query("Select FormasPagamento(3,'01/01/2010','31/12/2099','And V.Codigo=''"+venda+"''');", (error, results) => {
    if (error) {
      throw error
    }
    pool.query("SELECT * from tparcelas", (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).json(results.rows)
    })
  })
}

const getRedefinicaoCliente = (request, response) => {
  
  var cpfref = typeof(request.body.cpf) === undefined ? '' : request.body.cpf
  var emailRedefinicao = typeof(request.body.email) === undefined ? '' : request.body.email
  var validarcodigo = typeof(request.body.validar) === undefined ? '' : request.body.validar
  var novasenha = typeof(request.body.novasenha) === undefined ? '' : request.body.novasenha
  var codigorandomico =  Math.floor(Math.random() * (999999 - 1 + 1))+1

  if(cpfref !== undefined){
    pool.query('Select trim(email) as email, cpfcnpj as cpf from pessoas where cpfcnpj = $1', [cpfref], (error, results) => {
      if (error) {
        throw error
      }
      if(results.rowCount === 0){
        response.status(200).send('INVALID!')
      }else{
        results.rows.map((email)=>{
          response.status(200).send({email: email.email, cpf: email.cpf})
         })
      }
      cpfref = undefined

    })
  }else if(emailRedefinicao !== undefined){
    pool.query("Select codigo from validacao_email_codigos_portal where utilizado = 'F' and email = '"+emailRedefinicao+"'", (error, results) => {
       if (error) {
        throw error
      }
      if(results.rowCount > 0){
        pool.query("update validacao_email_codigos_portal set utilizado = 'T' where email = '"+emailRedefinicao+"'", (error, results) => {
          if (error) {
            throw error
          } 
        })
      }
      let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, 
        auth: {
          user: "suporte@bassotech.com.br", 
          pass: "Seta@159", 
        },
      });

      transporter.sendMail({
        from: 'Redefinição de Senha Portal do Cliente [LOJAS LEVE] <suporte@bassotech.com.br>', 
        to: emailRedefinicao, 
        subject: "Redefinição de Senha Portal do Cliente [LOJAS LEVE]", 
        text: "Olá Cliente! Você solicitou a redefinição de senha no Portal do Cliente", 
        html: `<p>Olá Cliente! Você solicitou a redefinição de senha no Portal do Cliente<br/>Segue o código para ser informado no portal: <b> ${codigorandomico}</b></p>`, 
      })
      .then(() => 
        console.log('E-mail enviado com sucesso!'),
        pool.query("INSERT INTO validacao_email_codigos_portal (codigo_gerado, email, utilizado) values ('"+codigorandomico+"','"+emailRedefinicao+"', 'F')", (error, results) => {
          if (error) {
            throw error
          }
        })
      )
      .catch((err) => console.log('Erro ao enviar e-mail: ',err))
    })
  }else if(validarcodigo !== undefined){
    var emailValidacao = request.body.emailvalidacao
    pool.query("Select codigo from validacao_email_codigos_portal where codigo_gerado = '"+validarcodigo+"' and email = '"+emailValidacao+"' and utilizado = 'F'", (error, results) => {
      if (error) {
       throw error
     }
     if(results.rowCount > 0){
      pool.query("update validacao_email_codigos_portal set utilizado = 'T' where codigo_gerado = '"+validarcodigo+"' and email = '"+emailValidacao+"' and utilizado = 'F'", (error, results) => {
        if (error) {
         throw error
       }
        response.status(200).send(validarcodigo)
      })
     }else{
        response.status(200).send('INVALID!')
     }

    })
  } 
  if(novasenha !== undefined){
    var cpfcnpj = request.body.cpf
    pool.query("update pessoas set senha = '"+novasenha+"' where cpfcnpj = '"+cpfcnpj+"'", (error, results) => {
      if (error) {
       throw error
     }
    })
  }
}
// const getUsers = (request, response) => {
  
// }

// //Seleciona todos os dados
// const getAllCompras=(request,response) =>{

//   //pool.query('select * from entity_facts ', (error,results)=>
//   pool.query("select venda, clientecodigo, trim(cliente) as cliente, vendedorcodigo, trim(vendedor), trim(condicao), data, hora, itens, total, subtotal, empresacodigo, trim(empresa), avista, aprazo from vvendasportal", (error,results)=>
//   {
//     if(error)
//     throw error
//     response.status(200).json(results.rows)
//   }
//   )
// }

// //Deleta dado do banco pelo id
// const deleteUser= (request, response) => {
  
//   const id = request.params.id;
  
//  console.log('id is '+id)

//   pool.query('delete from entity_facts where id=$1',[id],(error,results)=>
//   {
//     if(error)
//     throw error
//     response.status(200).send(`deleted id is ${id}`)
//   })
// }

// //Altera dado do banco pelo id
// const updateUser= (request, response) =>
// {
//   const id = request.params.id;
//   const {entity,details} = request.body
//   console.log('id is '+id)

//   pool.query('update entity_facts set entity=$1, details=$2 where id=$3',[entity,details,id], (error,results)=>
//   {
//     if(error){
//       throw error
//     }
//     response.status(200).send(`user modified with ${id}`)
//   })
// }


module.exports ={
// createUser,
getCompraByCliente,
getLimiteByCliente,
getProdutosByVenda,
getFaturasByCliente,
getFormasPagamentoByVenda,
getAcrescimosFinanceiroByCliente,
getDescontosFinanceiroByCliente,
getFinanceiroByCliente,
getPontosFidelidadeByCliente,
createCliente,
getUserCliente,
getRedefinicaoCliente
// deleteUser,
// updateUser

}



