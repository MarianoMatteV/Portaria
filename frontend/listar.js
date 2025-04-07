// LISTAR MORADOR

document.addEventListener("DOMContentLoaded", () => {
  listarDados();
});
async function listarDados() {
  const response = await fetch('http://localhost:3001/listar/dados');
  const data = await response.json();
  const tbody = document.getElementById('tbody');
  tbody.innerHTML = '';

  const moradores = data[0].moradores;
  const veiculo = data[1].veiculo;

  moradores.forEach(morador => {
    // Filtra todos os veículos que pertencem a esse morador
    const carros_morador = veiculo.filter(v => v.email === morador.email);

    if (carros_morador.length > 0) {
      // Se tiver um ou mais veículos, cria uma linha para cada veículo
      carros_morador.forEach(veiculo => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${morador.nome}</td>
          <td>${morador.bloco}</td>
          <td>${morador.apartamento}</td>
          <td>${morador.telefone}</td>
          <td>${morador.status}</td>
          <td>${veiculo.placa}</td>
          <td>${veiculo.modelo}</td>
          <td>${veiculo.cor}</td>
          <td>${veiculo.email}</td>
          <td>${veiculo.box}</td>

          <td>
            <button id="remover" onclick="excluir('${veiculo.email}', '${morador.email}')"
            >Excluir</button>
          </td>
          <td>
            <button id="editar" 
            onclick="abrirModal('${morador.nome}','${morador.bloco}','${morador.apartamento}', '${morador.telefone}','${morador.email}', '${veiculo.placa}','${veiculo.modelo}', '${veiculo.cor}','${veiculo.box}')"
            >Editar</button>

          </td>
        `;
        tbody.appendChild(row);
      });
    } else {
      // Caso não tenha um veículo, cria uma linha só com os dados do morador
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${morador.nome}</td>
        <td>${morador.bloco}</td>
        <td>${morador.apartamento}</td>
        <td>${morador.telefone}</td>
        <td>${morador.email}</td>
        <td>${morador.status}</td>
        <td colspan="6" style="text-align: center;">Sem veículo</td>
        <td></td>
      `;
      tbody.appendChild(row);
    }
  });
}
  
// -----------------------------------

  // EXCLUIR
  
  async function excluir(email) {
    const response = await fetch(`http://localhost:3001/deletar/${email}`, {
        method: 'DELETE'
    });
  
    const result = await response.json();
    if (result.success) {
        alert('Informações do morador deletadas com sucesso!');
        listarDados(); // Recarrega a lista após a exclusão
    } else {
        alert(result.message || 'Erro ao deletar informações do morador.');
    }
  }
  
  // MODAL
  
  // Função para abrir o modal e preencher os campos
  function abrirModal(nome, bloco, apartamento, telefone, status, placa, modelo, email, box) {
    emailAntigo = email

    document.getElementById('nome').value = nome;
    document.getElementById('bloco').value = bloco;
    document.getElementById('apartamento').value = apartamento;
    document.getElementById('telefone').value = telefone;
    document.getElementById('status').value = status;
    document.getElementById('placa').value = placa;
    document.getElementById('modelo').value = modelo;
    document.getElementById('email').value = email;
    document.getElementById('box').value = box;
  
    // Exibir o modal
    document.getElementById('modal').style.display = 'block';
  
    
  }
  
  // Função para fechar o modal
  function fecharModal() {
    document.getElementById('modal').style.display = 'none';
  }


  // EDITAR

async function editarDados() {
    const nome = document.getElementById('nome').value;
    const bloco = document.getElementById('bloco').value;
    const apartamento = document.getElementById('apartamento').value;
    const telefone = document.getElementById('telefone').value;
    const status = document.getElementById('status').value;
    const placa = document.getElementById('placa').value;
    const modelo = document.getElementById('modelo').value;
    const cor = document.getElementById('cor').value;
    const email = document.getElementById('email').value;
    const box = document.getElementById('box').value;
  
    console.log('Dados enviados:', { nome, bloco, apartamento, telefone, status, placa, modelo, cor , email, box });
  
    const response = await fetch(`http://localhost:3001/editar/${emailAntigo}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({nome, bloco, apartamento, telefone, status, placa, modelo, cor, email, box})
    });
  
    const result = await response.json();
    if (result.success) {
        alert('Informações do morador editadas com sucesso!');
        listarDados();
        fecharModal();
    } else {
        alert(result.message || 'Erro ao editar informações do morador!');
    }
  }

  function updateSizeInfo() {
    let largura = window.innerWidth
    // document.getElementById("sizeInfo").textContent = `Largura da janela: ${largura}px`

    let container = document.getElementById("container")
    let inputs = document.querySelectorAll("input, select")

    if (largura < 600) {
        container.style.backgroundColor = "#222"
        inputs.forEach(input => {
            input.style.width = "70%"
            input.style.padding = "6px"
        })
    } else {
    if (largura < 600) {
        container.style.backgroundColor = "#222"
        inputs.forEach(input => {
            input.style.width = "70%"
            input.style.padding = "6px"
        })
    }
    }
}

