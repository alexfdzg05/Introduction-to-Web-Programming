const forum = document.getElementById('forum')

forum.addEventListener("submit", searchShows)

const searchUrl = "https://api.tvmaze.com/search/shows?q="


async function searchShows(event){
    event.preventDefault()
    const inputShow = document.getElementById("input-show").value

    const searchParameter = `${searchUrl}${inputShow}`; 
    // Get fetch from the API
    const searchData = await (await fetch(searchParameter)).json();

    // Delete previous research
    const showContainer = document.querySelector(".show-container")
    showContainer.innerHTML = "";

    //Append the shows 
    searchData.forEach(element => {
    const show = element.show;
    
    const showData = document.createElement("div")
            showData.className = "show-data";
    const image = document.createElement("img")
            image.src = show.image ? show.image.medium : "";
    const infoDiv = document.createElement("div")
            infoDiv.className = "show-info";
    const title = document.createElement("h1")
            title.textContent = show.name;
    const summary = document.createElement("div")
            summary.innerHTML = show.summary;
    
    showData.appendChild(image)

    infoDiv.appendChild(title)
    infoDiv.appendChild(summary)

    showData.appendChild(infoDiv)    
    // Append
    showContainer.appendChild(showData)
    });
}

