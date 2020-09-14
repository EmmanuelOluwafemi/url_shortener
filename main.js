
let links = document.querySelector(".links");
let errorText = document.querySelector(".error-text");
const submitButton = document.querySelector("#submitLink");
const urlInput = document.querySelector("#urlLink");
const errorFormHandling = document.querySelector(".shortenLinks__error");
const APILink = `https://rel.ink/api/links/`;

// Validate input

let validateInput = () => {
    if (urlInput.value === ""){
        urlInput.classList.add("error");
        errorText.classList.add("show");
    }
    else{
        urlInput.classList.remove("error");
        errorText.classList.remove("show");
    }
}





// Fetch api from API

const fetchLink = async (link) => {

    // post link to api

    const response = await fetch(APILink, {
        method: 'POST',
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        credentials: "same-origin",
        body: JSON.stringify({ url: link }),
    });

    const data = await response.json(link);
    console.log(data)

    // Get short link from api
    const getLink = await fetch(`${APILink}${data.hashid}`, {
        method: 'GET',
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        credentials: "same-origin",
    });
    
    const resultJson = await getLink.json();
    console.log(resultJson);

    // input Url
    let inputUrl = resultJson.url.substr(0, 50) + "...";
    console.log(inputUrl)

    // ShortenedUrl link
    let shortenedUrl = "https://rel.ink/" + resultJson.hashid;
    console.log(shortenedUrl)

    localStorage.setItem(inputUrl, shortenedUrl);

    location.reload();
}

// Show Url

const showUrlList = () => {
    for(let i = 0; i < localStorage.length; i++){
        const key = localStorage.key(i);
        const value = localStorage.getItem(key);

        console.log(key + ' : ' + value);

        const list = document.createElement('div');
        list.classList.add('link');
        list.classList.add('py-3');
        list.classList.add('px-4');
        list.classList.add('mb-3');

        list.innerHTML = `
        <p class="posted-link m-0 text-dark-violet text-sm-left pb-3 pb-lg-0">${key}</p>
        <div class="gen-link">
        <input type="text" id="copy" class="mr-4 text-green text-sm-left" value="${value}" readonly="readonly">
          <button id="copyBtn" class="btn bg-green rounded py-2 copy-btn" onclick="copyToClip()">Copy</button>
        </div>
        `;

        links.appendChild(list);

        urlInput.value = "";
    }
}

// Copy to Clipboard

const copyToClip = (e) => {
    const copy = document.querySelector("#copy");
    const copyBtn = document.querySelector("#copyBtn");
    copy.select();
    document.execCommand("copy");
    copyBtn.classList.add("active");
    copyBtn.textContent = "Copied!"
}

// Submit Button

submitButton.addEventListener("click", (e) => {
    e.preventDefault();
    if(!validateInput()){
        fetchLink(urlInput.value);
    }
})

showUrlList()