document.addEventListener('DOMContentLoaded', () => {
    const wrapper = document.querySelector('.wrapper');
    const searchInput = wrapper.querySelector('input');
    const volumeIcon = wrapper.querySelector('.word i');
    const infoText = wrapper.querySelector('.info-text');
    const synonymsList = wrapper.querySelector('.synonyms .list');
    const removeIcon = wrapper.querySelector('.search span');
    let audio;

    searchInput.addEventListener("keyup", handleSearch);

    volumeIcon.addEventListener("click", handleVolumeIconClick);

    removeIcon.addEventListener("click", handleRemoveIconClick);

    function handleSearch(event) {
        let word = event.target.value.trim();
        if (event.key === "Enter" && word) {
            fetchApi(word);
        }
    }

    function handleVolumeIconClick() {
        if (audio) {
            volumeIcon.style.color = '#4D59FB';
            audio.play();
            setTimeout(() => {
                volumeIcon.style.color = '#999';
            }, 800);
        }
    }

    function handleRemoveIconClick() {
        searchInput.value = "";
        searchInput.focus();
        wrapper.classList.remove("active");
        updateInfoText("Type any existing word and press enter to get meaning, example, synonyms, etc.", '#dcee6a');
    }

    function search(word) {
        fetchApi(word);
        searchInput.value = word;
    }

    function fetchApi(word) {
        wrapper.classList.remove("active");
        updateInfoText(`Searching the meaning of <span>${word}</span>`, '#000');
        let url = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;
        fetch(url)
            .then(response => response.json())
            .then(result => data(result, word))
            .catch(() => {
                updateInfoText(`Can't find the meaning of <span>${word}</span>. Please, try to search for another word.`, '#cc3333');
            });
    }

    function data(result, word) {
        if (result.title) {
            updateInfoText(`Can't find the meaning of <span>${word}</span>. Please, try to search for another word.`, '#cc3333');
        } else {
            wrapper.classList.add("active");
            let definitions = result[0].meanings[0].definitions[0];
            let phonetics = `${result[0].meanings[0].partOfSpeech} /${result[0].phonetics[0].text}/`;

            updateElementText(".word p", result[0].word);
            updateElementText(".word span", phonetics);
            updateElementText(".meaning span", definitions.definition);
            updateElementText(".example span", definitions.example);

            audio = new Audio("https:" + result[0].phonetics[0].audio);

            updateSynonymsList(definitions.synonyms);
        }
    }

    function updateElementText(selector, text) {
        const element = document.querySelector(selector);
        if (element) {
            element.innerText = text;
        }
    }

    function updateInfoText(text, color) {
        infoText.innerHTML = text;
        infoText.style.color = color;
    }

    function updateSynonymsList(synonyms) {
        if (synonyms && synonyms.length > 0) {
            synonymsList.parentElement.style.display = 'block';
            synonymsList.innerHTML = "";
            for (let i = 0; i < Math.min(5, synonyms.length); i++) {
                let tag = `<span onclick="search('${synonyms[i]}')">${synonyms[i]},</span>`;
                tag = i === 4 ? `<span onclick="search('${synonyms[i]}')">${synonyms[i]}</span>` : tag;

                synonymsList.insertAdjacentHTML("beforeend", tag);
            }
        } else {
            synonymsList.parentElement.style.display = 'none';
        }
    }
});
