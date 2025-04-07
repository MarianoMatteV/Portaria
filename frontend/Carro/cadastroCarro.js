async function cadastrarCarro(event) {
    event.preventDefault();

    const placa = document.getElementById('placa').value;
    const modelo = document.getElementById('modelo').value;
    const cor = document.getElementById('cor').value;
    const box = document.getElementById('box').value;
    const email = document.getElementById('email').value;
  
    console.log(placa, modelo, cor, box, email);
  
    const response = await fetch('http://localhost:3001/veiculo/cadastrar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ placa, modelo, cor, box, email })
    });
  
    const result = await response.json();
  
    if (result.success) {
        alert("Cadastro feito com sucesso");
        window.location.href = "../listar.html";
    } else {
        alert(result.message || "Houve um erro ao cadastrar");
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

