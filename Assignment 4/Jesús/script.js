const form = document.getElementById("search-form");
const input = document.getElementById("input-show");
const results = document.getElementById("results");

form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const query = input.value.trim();

    const url = `https://api.tvmaze.com/search/shows?q=${encodeURIComponent(query)}`;
    const res = await fetch(url);
    const data = await res.json();

    results.innerHTML = "";

    data.forEach(item => {
        const show = item.show;
        const showDiv = document.createElement("div");
        showDiv.classList.add("show-data");

        const img = document.createElement("img");
        if (show.image){
            img.src = show.image.medium;
        }else{
            // We add a placeholder image if the json doesnt have an image
            img.src = "https://via.placeholder.com/210x295?text=No+Image";
        }

        const infoDiv = document.createElement("div");
        infoDiv.classList.add("show-info");

        const title = document.createElement("h1");
        title.textContent = show.name;

        const summary = document.createElement("div");
        summary.innerHTML = show.summary;

        showDiv.appendChild(img);
        showDiv.appendChild(infoDiv);

        infoDiv.appendChild(title);
        infoDiv.appendChild(summary);

        results.appendChild(showDiv);
    });
});