let input = document.getElementById("input-box");
let searchButton = document.getElementById("search-button");
let showContainer = document.getElementById("show-container");
let listContainer = document.querySelector(".list");
let favListContainer = document.getElementById("fav_list_container");
let favCloseButton = document.getElementById("fav-close-btn");
let myFavNavButton = document.getElementById("my-fav-nav-btn");
let searchNavButton = document.getElementById("search-nav-btn");
let countFav = document.getElementById("countFavChar");
let modal = document.getElementById("myModal");
var span = document.getElementsByClassName("close")[0];
let modalDiv = document.getElementById("modalDiv");

const [timestamp, apiKey, hashValue] = [ts, publicKey, hashVal];
let windowLoaded = false;

// Loading data from the local storage saved as favourite 
let fav_char_id_list = [];
try {
    fav_char_id_list = JSON.parse(localStorage.getItem('id-array'));
}
catch (err) {
    fav_char_id_list = [];
}

// Function executed when typing in the search bar whenver the key is released
input.addEventListener("keyup", (getRsult = async () => {
    showContainer.innerHTML = "";
    if (input.value.length < 3) {
        return false;
    }

    const url = `https://gateway.marvel.com:443/v1/public/characters?ts=${timestamp}&apikey=${apiKey}&hash=${hashValue}&nameStartsWith=${input.value}`;

    const response = await fetch(url);
    const jsonData = await response.json();
    console.log(jsonData);
    showContainer.innerHTML = "";
    jsonData.data["results"].forEach((element) => {
        let div = document.createElement("div");
        div.style.cursor = "pointer";
        div.classList.add("card-container");

        let charContainer = document.createElement("div");
        charContainer.classList.add("container-character-image");
        charContainer.innerHTML = `<img src="${element.thumbnail["path"] + "." + element.thumbnail["extension"]}"/>`;

        let charName = document.createElement("div");
        charName.classList.add("character-name");
        charName.innerHTML = `${element.name}`;

        let charDesc = document.createElement("div");
        charDesc.classList.add("character-description");
        charDesc.innerHTML = `${element.id}`;

        const favBtn = document.createElement("button");
        favBtn.classList.add("character-addToFav-btn");
        let characterID = `${element.id}`;
        favBtn.setAttribute('id', 'id' + characterID);
        favBtn.innerHTML = "Add to favourite";

        console.log('id' + characterID);

        const detailBtn = document.createElement("button");
        detailBtn.classList.add("character-detail-btn");
        detailBtn.setAttribute('id', 'detail' + characterID);
        detailBtn.innerHTML = "Detail >>";

        div.appendChild(charContainer);
        div.appendChild(charName);
        // div.appendChild(charDesc);
        div.appendChild(favBtn);
        div.appendChild(detailBtn);

        showContainer.appendChild(div);
        document.getElementById('id' + characterID).addEventListener("click", () => {
            addToFav(characterID);
        });

        document.getElementById('detail' + characterID).addEventListener("click", () => {
            showModal(characterID);
        });
    });
}));

// Function executed when "add to favourite" button is pressed
addToFav = async (charID) => {
    if (fav_char_id_list.includes(charID) && windowLoaded) {
        alert("Character already added...");
    } else {
        let url = `https://gateway.marvel.com:443/v1/public/characters/${charID}?ts=${timestamp}&apikey=${apiKey}&hash=${hashValue}`;
        const response = await fetch(url);
        const jsonData = await response.json();
        // console.log(jsonData);

        jsonData.data["results"].forEach((element) => {

            let div = document.createElement("div");
            div.style.cursor = "pointer";
            div.classList.add("fav-card-container");
            let characterID = `${element.id}`;
            div.setAttribute('id', 'fav' + characterID);
            // console.log(div.id);

            let charContainer = document.createElement("div");
            charContainer.classList.add("fav-container-character-image");
            charContainer.innerHTML = `<img src="${element.thumbnail["path"] + "." + element.thumbnail["extension"]}"/>`;

            let charFeatureContainer = document.createElement("div");
            charFeatureContainer.classList.add("fav-char-details-div");

            let charName = document.createElement("div");
            charName.classList.add("fav-character-name");
            charName.innerHTML = `${element.name}`;

            let charDesc = document.createElement("div");
            charDesc.classList.add("fav-character-description");
            charDesc.innerHTML = `${element.description}`;

            const detailBtn = document.createElement("button");
            detailBtn.classList.add("fav-character-detail-btn");
            detailBtn.innerHTML = "Detail >>";
            detailBtn.setAttribute('id', 'favDetail' + characterID);

            const removeBtn = document.createElement("button");
            removeBtn.classList.add("fav-character-remove-btn");
            removeBtn.innerHTML = "Remove";
            removeBtn.setAttribute('id', 'remove' + characterID);

            div.appendChild(charContainer);
            charFeatureContainer.appendChild(charName);
            charFeatureContainer.appendChild(charDesc);
            charFeatureContainer.appendChild(detailBtn);
            charFeatureContainer.appendChild(removeBtn);

            div.appendChild(charFeatureContainer);

            favListContainer.appendChild(div);

            document.getElementById('remove' + characterID).addEventListener("click", () => {
                fav_char_id_list.splice(fav_char_id_list.indexOf(characterID), 1);
                localStorage.setItem('id-array', JSON.stringify(fav_char_id_list));
                document.getElementById('fav' + characterID).remove();
                countFav.innerHTML = `(${fav_char_id_list.length} favourites)`;
            });

            document.getElementById('favDetail' + characterID).addEventListener("click", () => {
                showModal(characterID);
            });
        });
        if (!fav_char_id_list.includes(charID)) {
            fav_char_id_list.push(charID);
            localStorage.setItem('id-array', JSON.stringify(fav_char_id_list));
        }
        countFav.innerHTML = `(${fav_char_id_list.length} favourites)`;
    }
}

showModal = async (charID) => {
    modalDiv.innerHTML = "";
    modal.style.display = "block";
    // When the user clicks on <span> (x), close the modal
    span.onclick = function () {
        modal.style.display = "none";
    }

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }

    let url = `https://gateway.marvel.com:443/v1/public/characters/${charID}?ts=${timestamp}&apikey=${apiKey}&hash=${hashValue}`;
    const response = await fetch(url);
    const jsonData = await response.json();
    // console.log(jsonData);

    jsonData.data["results"].forEach((element) => {

        let div = document.createElement("div");
        div.style.cursor = "pointer";
        div.classList.add("modal-card-container");
        let characterID = `${element.id}`;
        div.setAttribute('id', 'fav' + characterID);
        // console.log(div.id);

        let charContainer = document.createElement("div");
        charContainer.classList.add("modal-container-character-image");
        charContainer.innerHTML = `<img src="${element.thumbnail["path"] + "." + element.thumbnail["extension"]}"/>`;

        let charFeatureContainer = document.createElement("div");
        charFeatureContainer.classList.add("modal-char-details-div");

        let charName = document.createElement("div");
        charName.classList.add("modal-character-name");
        charName.innerHTML = `${element.name}`;

        let charDesc = document.createElement("div");
        charDesc.classList.add("modal-character-description");
        charDesc.innerHTML = `${element.description}`;

        let charComics = document.createElement("div");
        charComics.classList.add("modal-character-comics");
        charComics.innerHTML = `Comics : ${element.comics.available}`;
        // console.log(element.comics.items);
        // element.comics.items.forEach((items) => {console.log(items.name)});

        let charStories = document.createElement("div");
        charStories.classList.add("modal-character-stories");
        charStories.innerHTML = `Stories : ${element.stories.available}`;
        console.log(element.stories);

        let charEvents = document.createElement("div");
        charEvents.classList.add("modal-character-events");
        charEvents.innerHTML = `Events : ${element.events.available}`;

        let charSeries = document.createElement("div");
        charSeries.classList.add("modal-character-series");
        charSeries.innerHTML = `Series : ${element.series.available}`;

        let charModified = document.createElement("div");
        charModified.classList.add("modal-character-modified");
        charModified.innerHTML = `Last Modified : ${element.modified}`;
        console.log(element.modified);

        div.appendChild(charContainer);
        charFeatureContainer.appendChild(charName);
        charFeatureContainer.appendChild(charDesc);
        charFeatureContainer.appendChild(charComics);
        charFeatureContainer.appendChild(charStories);
        charFeatureContainer.appendChild(charEvents);
        charFeatureContainer.appendChild(charSeries);
        charFeatureContainer.appendChild(charModified);

        div.appendChild(charFeatureContainer);
        modalDiv.appendChild(div);
    });
}


searchButton.addEventListener("click", getRsult);

searchNavButton.addEventListener('click', () => {
    document.querySelector(".body-container").style.gridTemplateColumns = "9fr 0fr";
    document.querySelector("#favourite-box").style.width = '0px';
});

favCloseButton.addEventListener("click", () => {
    // document.querySelector(".favourite-container").style.visibility = 'hidden';
    document.querySelector(".body-container").style.gridTemplateColumns = "9fr 0fr";
    document.querySelector("#favourite-box").style.width = '0px';
});

myFavNavButton.addEventListener("click", () => {
    // document.querySelector(".favourite-container").style.visibility = 'visible';
    document.querySelector(".body-container").style.gridTemplateColumns = "9fr 4fr";
    document.querySelector("#favourite-box").style.width = '100%';
});

// Function run when window is loaded
window.onload = () => {
    getRsult();
    countFav.innerHTML = `(${fav_char_id_list.length} favourites)`;
    fav_char_id_list.forEach((charId) => {
        addToFav(charId);
        windowLoaded = false;
    })
    windowLoaded = true;
};