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

function topAnime(){
    const base_url = "https://api.jikan.moe/v3/top/anime/1/upcoming";

    fetch(base_url)
        .then(res => res.json())
        // .then(data => {
        //     console.log(data)
        // })
        .then(updateDom)
        .catch(err => console.warn('Fetch Error: ', err))
}

function updateTop(){
    const browseBtn = document.getElementById('browse-btn');

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
            text_truncate = function(str, length, ending) {
                if (length == null) {
                  length = 100;
                }
                if (ending == null) {
                  ending = '...';
                }
                if (str.length > length) {
                  return str.substring(0, length - ending.length) + ending;
                } else {
                  return str;
                }
              };
            let synopsis = text_truncate(anime.synopsis);
            return `
            <div class="col s12 m6">
            <div class="card">
              <div class="card-image">
                <img src=${anime.image_url}>
              </div>
              <h3 class="card-title">${anime.title}</h3>
              <div class="card-content">
                <p>${synopsis}</p>
              </div>
              <a  href=${anime.url} class="waves-effect waves-light btn" target="_blank">More Info</a>
            </div>
            </div>

   
            `
        }).join(" ");
        return `
            <section>
                <h3 class='title-category'>${key.toUpperCase()}</h3>
                <div class="anime-row">${animesHTML}</div>
            </section>
        `
    })
}

       

document.addEventListener("DOMContentLoaded", function(){
    const form = document.getElementById('search_form');
    form.addEventListener('submit',searchAnime)
})


