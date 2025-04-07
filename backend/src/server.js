const express = require('express');
const cors = require('cors');

const porta = 3001;
const app = express();

app.use(cors());
app.use(express.json());


const connection = require('./db_config.js');

// CADASTRO MORADORES

app.post('/morador/cadastrar', (request, response) => {
    let params = Array(
        request.body.nome,
        request.body.bloco,
        request.body.apartamento,
        request.body.telefone,
        request.body.email,
        request.body.status
    );
 console.log(params)
    let query = "INSERT INTO moradores(nome, bloco, apartamento, telefone, email, status) values(?,?,?,?,?,?);";
   
    connection.query(query, params, (err, results) => {
        if(results) {
            response
            .status(201)
            .json({
                success: true,
                message: "Sucesso no cadastro",
                data: results
            })
 
        } else {
            response
            .status(400)
            .json({
                success: false,
                message: "Erro no cadastro",
                data: err
            })
        }
    })
});


// ------------------------------------------------------------------------------------
// CADASTRO VEÍCULOS

  app.post('/veiculo/cadastrar', (req, res) => {
    const { placa, modelo, cor, email, box } = req.body;
  
    // Verifica se o email existe na tabela moradores
    const verificarMorador = 'SELECT * FROM moradores WHERE email = ?';
    connection.query(verificarMorador, [email], (err, results) => {
      if (err) {
        console.error('Erro ao verificar morador:', err);
        return res.status(500).json({ success: false, message: 'Erro ao verificar morador.' });
      }
  
      if (results.length === 0) {
        return res.status(404).json({ success: false, message: 'Não foi encontrado nenhum morador com este email.' });
      }
  
      // Verifica se a vaga já está ocupada
      const verificarVaga = 'SELECT * FROM veiculos WHERE box = ?';
      connection.query(verificarVaga, [box], (err, boxResult) => {
        if (err) {
          console.error('Erro ao verificar vaga:', err);
          return res.status(500).json({ success: false, message: 'Erro ao verificar vaga.' });
        }
  
        if (boxResult.length > 0) {
          return res.status(400).json({ success: false, message: 'Vaga já ocupada.' });
        }
  
        // Verifica se a placa já está cadastrada
        const verificarPlaca = 'SELECT * FROM veiculos WHERE placa = ?';
        connection.query(verificarPlaca, [placa], (err, placaResult) => {
          if (err) {
            console.error('Erro ao verificar placa:', err);
            return res.status(500).json({ success: false, message: 'Erro ao verificar placa.' });
          }
  
          if (placaResult.length > 0) {
            return res.status(400).json({ success: false, message: 'Placa já cadastrada.' });
          }
  
          // Insere o veículo
          const insertQuery = 'INSERT INTO veiculos (placa, modelo, cor, email, box) VALUES (?, ?, ?, ?, ?)';
          connection.query(insertQuery, [placa, modelo, cor, email, box], (err, insertResult) => {
            if (err) {
              console.error('Erro ao cadastrar veículo:', err);
              return res.status(500).json({ success: false, message: 'Erro ao cadastrar veículo.' });
            }
  
            res.json({ success: true, message: 'Veículo cadastrado com sucesso.' });
          });
        });
      });
    });
  });


// -------------------------------------------------------------------------------------

// LISTAR

app.get('/listar/dados', (req, res) => {
  const dados = [];

  const query1 = 'SELECT * FROM moradores';
  connection.query(query1, (err, moradores) => {
      if (err) {
          console.error('Erro ao buscar moradores:', err);
          return res.status(500).json({ erro: 'Erro ao buscar moradores' });
      }

      dados.push({ moradores });

      const query2 = 'SELECT * FROM veiculos';
      connection.query(query2, (err, veiculo) => {
          if (err) {
              console.error('Erro ao buscar veículos:', err);
              return res.status(500).json({ erro: 'Erro ao buscar veículos' });
          }

          dados.push({ veiculo });

          res.json(dados);
      });
  });
});

//-----------------------------------------------------------------------------------

// DELETE

  app.delete('/deletar/:email', (req, res) => {
    const {email} = req.params;
    const query = 'DELETE FROM veiculos WHERE email = ?';
    const query1 = 'DELETE FROM moradores WHERE email = ?';
    connection.query(query, [email], (err) => {
      if (err) {
        return res.status(500).json({ success: false, message: 'Erro ao remover carro.' });
      }
      res.json({ success: true, message: 'Carro removido com sucesso!' });
    });
    connection.query(query1,[email],(err) => {
      if (err) {
        return res.status(500).json({ success: false, message: 'Erro ao remover carro.' });
      }
    })
  });


  
// ------------------------------------------------------------------------

// EDITAR

  app.put("/editar/:email", (req, res) => {
    const emailAntigo = req.params.email;
    const { nome, bloco, apartamento, telefone, status, placa, modelo, cor, email, box } = req.body;

  console.log('Requisição recebida:', {
    emailAntigo, nome, bloco, apartamento, telefone, status, placa, modelo, cor, email, box
  });


// Verifica se a placa já foi cadastrada
const queryVerificarPlaca = `SELECT * FROM veiculos WHERE placa = ? AND email != ?`;

connection.query(queryVerificarPlaca, [placa, emailAntigo], (err, resultPlaca) => {
    if (err) {
        console.error('Erro ao verificar placa:', err);
        return res.status(500).json({ success: false, message: 'Erro ao verificar placa.' });
    }

    if (resultPlaca.length > 0) {
        return res.status(400).json({ success: false, message: 'Placa já cadastrada!' });
    }

    // Verifica se a vaga já está ocupada por outro veículo
      const queryVerificarBox = `SELECT * FROM veiculos WHERE box = ? AND email != ?`;

      connection.query(queryVerificarBox, [box, emailAntigo], (err, resultBox) => {
          if (err) {
              console.error('Erro ao verificar vaga:', err);
              return res.status(500).json({ success: false, message: 'Erro ao verificar vaga.' });
          }

          if (resultBox.length > 0) {
              return res.status(400).json({ success: false, message: 'Vaga já está ocupada!' });
          }

          // Se passou nas verificações, atualiza os dados do morador
          const queryMorador = `UPDATE moradores SET nome = ?, bloco = ?, apartamento = ?, telefone = ?, email = ?, status = ? WHERE email = ?`;

          connection.query(queryMorador, [nome, bloco, apartamento, telefone, email, status, emailAntigo], (err) => {
              if (err) {
                  console.error('Erro ao atualizar morador:', err);
                  return res.status(500).json({ success: false, message: 'Erro ao atualizar morador.' });
              }

              // Atualiza os dados do veículo
              const queryVeiculo = `UPDATE veiculos SET placa = ?, modelo = ?, cor = ?, email = ?, box = ? WHERE email = ?`;

              connection.query(queryVeiculo, [placa, modelo, cor, email, box, emailAntigo], (err) => {
                  if (err) {
                      console.error('Erro ao atualizar veículo:', err);
                      return res.status(500).json({ success: false, message: 'Erro ao atualizar veículo.' });
                  }

                  res.json({ success: true, message: 'Dados atualizados com sucesso!' });
              });
          });
      });
  });
});


  // ---------------------------
  
  //   if (!placa || !placaNova) {
  //       return res.status(400).json({ mensagem: "Placa antiga e nova são obrigatórias." });
  //   }
  
  //   placa = placa.toUpperCase();
  //   placaNova = placaNova.toUpperCase();
  
  //   const checkQuery = "SELECT * FROM cadastroCarros WHERE placa = ?";
  //   connection.query(checkQuery, [placa], (err, resultados) => {
  //       if (err) {
  //           console.error("Erro ao verificar veículo:", err);
  //           return res.status(500).json({ mensagem: "Erro interno no servidor." });
  //       }
  
  //       if (resultados.length === 0) {
  //           return res.status(404).json({ mensagem: "Veículo não encontrado." });
  //       }
  
  //       const updateQuery = "UPDATE cadastroCarros SET placa = ? WHERE placa = ?";
  //       connection.query(updateQuery, [placaNova, placa], (err, updateResultados) => {
  //           if (err) {
  //               console.error("Erro ao editar veículo:", err);
  //               return res.status(500).json({ mensagem: "Erro interno no servidor." });
  //           }
  
  //           res.json({ success: true, mensagem: "Veículo editado com sucesso!" });
  //       });
  //   });
  // });
app.listen(porta, () => console.log(`Servidor rodando na porta ${porta}`));