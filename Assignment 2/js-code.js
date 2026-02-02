const button = document.getElementById("submit-data")
button.addEventListener("click", addUsernameToTable)

const clearButton = document.getElementById("empty-table")
clearButton.addEventListener("click", clearTable)

function addUsernameToTable(event){
    event.preventDefault()
    var table = document.getElementById("table")
    var username = document.getElementById("input-username").value
    var email = document.getElementById("input-email").value
    var isAdmin = document.getElementById("input-admin")
    var adminCheck = "-"
    if(isAdmin.checked){
        adminCheck = "X"
    }    

    const cells = document.querySelectorAll("td")
    var found = false
    let i = 0;
    while(i < cells.length && !found){
        
        if(cells[i].textContent === username){
            found = true
            const rowToEdit = cells[i].parentElement
            rowToEdit.cells[1].textContent = email
            rowToEdit.cells[2].textContent = adminCheck
        }

        i++
    }

    if(!found){
        arrayInfo = [username, email, adminCheck]
        var newRow = document.createElement("tr")
        for(let i= 0; i < 3; i++){
            var newCell = document.createElement("td")
            newCell.textContent = arrayInfo[i]
            newRow.appendChild(newCell)
            document.getElementById("Table").appendChild(newRow)
        }
    }
}


function clearTable(event) {
    event.preventDefault();

    const table = document.getElementById("Table");
    let nRows = table.rows.length
    while(nRows > 1){
        table.deleteRow(nRows-1)
        nRows--;
    }
    
}


