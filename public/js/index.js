console.log('im alive');

 // =============API KEY=============
// function getData(){
//     // let base_url_upcoming = "https://api.jikan.moe/v3/top/anime/1/upcoming";
//     let base_url = "https://api.jikan.moe/v3/top/anime";
//     fetch(`${base_url}/?q=${query}`)
//     .then(res => res.json())
//     .then(data => {
//         console.log(data)
//     })
//     .catch(err => console.warn('Fetch Error: ', err))
// }

function searchAnime(event){
    event.preventDefault();
    const form = new FormData(this);
    const query = form.get('search');
    console.log('query',query)

    const base_url = "https://api.jikan.moe/v3";

    fetch(`${base_url}/search/anime?q=${query}&page=1`)
        .then(res => res.json())
        // .then(data => {
        //     console.log(data)
        // })
        .then(updateDom)
        .catch(err => console.warn('Fetch Error: ', err))
}

function updateDom(data){
    const searchResults = document.getElementById('search_results');
    const animeByCategories = data.results
    .reduce((acc,anime)=>{
        const {type} = anime;
        if(acc[type] === undefined) acc[type] = [];
        acc[type].push(anime);
        return acc;

    },{})

    searchResults.innerHTML =  Object.keys(animeByCategories).map(key=>{
        const animes = animeByCategories[key]
        const animesHTML = animeByCategories[key]
        // .sort((a,b)=>a.episodes-b.episodes)
        .map(anime=>{
            return `
            <div class="card">
                <div class="card-image">
                    <img src="${anime.image_url}">
                </div>
                <div class="card-content">
                    <span class="card-title">${anime.title}</span>
                    <p>${anime.synopsis}</p>
                </div>
                <div class="card-action">
                    <a href="${anime.url}">Find out more</a>
                </div>
            </div>

   
            `
        }).join(" ");
        return `
            <section>
                <h3>${key.toUpperCase()}</h3>
                <div class="anime-row">${animesHTML}</div>
            </section>
        `
    })
}

       

document.addEventListener("DOMContentLoaded", function(){
    const container = document.getElementsByClassName('container');
    console.log(container)
   
 

    const form = document.getElementById('search_form');
    form.addEventListener('submit',searchAnime)
})


