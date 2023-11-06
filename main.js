/*  -----------------------------------------------------------------------------------------------
  chatGPT CONFIG.
--------------------------------------------------------------------------------------------------- */
const API_URL = "https://api.openai.com/v1/chat/completions";
const MODEL = "gpt-3.5-turbo";


/*  -----------------------------------------------------------------------------------------------
  WEB APP VARIABLES
--------------------------------------------------------------------------------------------------- */
const character = document.querySelectorAll('.character'); // array
const loader = document.querySelector(".loading");
const modal = document.querySelector(".modal");
const modalContent = document.querySelector(".modal-content");
const modalClose = document.querySelector(".modal-close");
const saveBtn = document.querySelector('#save');
const shareBtn = document.querySelector('#share');


/*  -----------------------------------------------------------------------------------------------
  FUNCTIONS
--------------------------------------------------------------------------------------------------- */

// GENERATE RANDOM ACTIONS 
function getRandomAction() {
    const actions = [
        'greet in your most iconic way',
        'give style advice based on your preferences',
        'tell about your latest adventure',
        'reveal your dreams',
        'tell me who your best friend is',
        'write your LinkedIn bio'
    ];


    // from zero to 5 
    const indexRandom = Math.floor(Math.random() * actions.length);
    return actions[indexRandom];
}


// PLAY GAME
async function playCharacter(nameCharacter) {

    console.log(nameCharacter);

    // show loader
    loader.classList.remove("loading-hidden");


    // generate a random action for GPT prompt
    const action = getRandomAction();

    // create GPT prompt with the character and action
    const completeChat = []; // array contains prompts for GPT

    completeChat.push({
        role: "user",
        content: `You are ${nameCharacter} and ${action} with a maximum of 100 characters without breaking character `
    });

    console.log(completeChat);

    // set GPT's creativity level
    const temperature = 0.7;


    // pass all parameters to the OpenAI API to query chatGPT
    const response = await fetch(API_URL, {

        method: "POST",
        headers: {
            "Content-type": "application/json",
            "Authorization": `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
            model: MODEL,
            messages: completeChat,
            temperature: temperature
        })

    })

    // get the response from chatGPT and convert it to JSON in the variable data
    const data = await response.json();

    // after converting to JSON, read the message created by chatGPT
    const message = data.choices[0].message.content;

    // hide loader
    loader.classList.add("loading-hidden");


    // remove spaces from the character's name to find the corresponding character image
    const nameImage = nameCharacter.replace(/\s+/g, '-');

    // display the modal with values from chatGPT
    modalContent.innerHTML = `
    <div class="character"><img src="./images/${nameImage}.png"></div>
    <h2>${nameCharacter}</h2>
    <p>${message}</p>
    <code>Character: ${nameCharacter} | Action: ${action} | Temperature: ${temperature}</code> `;

    modal.classList.remove("modal-hidden");
}


// SAVE QUOTE TO IMAGE
function saveQuote() {
    html2canvas(modalContent).then(function (canvas) {
        // document.body.appendChild(canvas);
        console.log(canvas);
        const dataURL = canvas.toDataURL('image/jpeg');
        const link = document.createElement('a');
        link.href = dataURL;
        link.download = 'quote.jpg';
        link.click();
    });
}


//  SHARE THE QUOTE
function shareQuote() {

    // 1. collect the message to share - retrieved directly from modal content
    const modalNameCharacter = modal.querySelector('h2').innerText;
    const modalQuote = modal.querySelector('p').innerText;

    const text = `Listen to what ${modalNameCharacter} has to say: "${modalQuote}" #quoteBOT #BooleanCodingWeek2023 `


    // 2. share using the Share API
    if (navigator.canShare) {
        navigator.share({ text: text });

    } else {

        console.error('Share API not supported');
        fallbackShare();
    }
}


// FALLBACK SHARE
function fallbackShare() {
    const href = 'https://wa.me/?text=${ encodeURIComponent(text) }';
    window.location.href = href;
}


/*  -----------------------------------------------------------------------------------------------
  INIT AND EVENTS
--------------------------------------------------------------------------------------------------- */

// PLAY GAME - QUOTE BY BOT
character.forEach(function (element) {
    element.addEventListener('click', function () {

        if (API_KEY != '') {
            playCharacter(element.dataset.description);
        } else {
            alert('API_KEY VARIABLE NOT DEFINED: \nYOU MUST REGISTER AN API KEY TO USE THIS WEB APP AND \nINSERT IT INTO A FILE NAMED config.js\n ie: const API_KEY = "value"; ');
        }
    })
})


// MODAL-CLOSE
modalClose.addEventListener('click', function () {
    modal.classList.add("modal-hidden");
    loader.classList.add("loading-hidden");
    // reset console to start a new game
    console.clear();
})


// SAVE BUTTON
saveBtn.addEventListener('click', saveQuote);


// SHARE BUTTON
shareBtn.addEventListener('click', shareQuote);
