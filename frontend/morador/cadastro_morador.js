async function cadastrarMorador(event) {
    event.preventDefault();

    const nome = document.getElementById('nome').value;
    const bloco = document.getElementById('bloco').value;
    const apartamento = document.getElementById('apartamento').value;
    const telefone = document.getElementById('telefone').value;
    const email = document.getElementById('email').value;
    const status = document.getElementById('status').value;

    const data = {nome,bloco,apartamento,telefone,email,status};


    const response = await fetch('http://localhost:3001/morador/cadastrar', {
        method: "POST",
        headers: {
            "Content-Type":"application/json"
        },
        body: JSON.stringify(data)
    })

    const results = await response.json();

    console.log(results);

    if(results.success) {
        window.location.href = "../Carro/cadastroCarro.html"
        alert(results.message)
    } else {
        alert(alert.message)
    }

}

// function updateSizeInfo() {
//     let largura = window.innerWidth
//     document.getElementById("sizeInfo").textContent = `Largura da janela: ${largura}px`
// }

// window.addEventListener("resize", updateSizeInfo)
// updateSizeInfo()

// ---------------------------

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
// window.addEventListener("resize", updateSizeInfo)
// updateSizeInfo()

async function acessarLista(event){
    event.preventDefault()
  
    window.location.href = "../listar.html";
  }