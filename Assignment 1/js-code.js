

const addHelloButton = document.getElementById("my-button")
const titulo = document.getElementById("title")

addHelloButton.addEventListener("click", hello)

const addDataButton = document.getElementById("add-data")

addDataButton.addEventListener("click", addData)




function hello () {
    console.log("Hello world!");
    titulo.textContent = "Moi maailma"
}

function addData(){
  const list = document.getElementById("my-list")
  const text = document.getElementById("Textbox")
  const element = document.createElement("li")
  element.textContent = text.value
  list.appendChild(element)
}
