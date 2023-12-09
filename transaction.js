const baseUrl = "";
let fromChain;
let toChain;
let recipientWallet;


    
const urlParams = new URLSearchParams(window.location.search);
let chatId = urlParams.get("id");


function selectNetwork1(network) {
    document.getElementById('btn1').style.display = 'block';
    document.getElementById('btn1').innerText = "Continue with " + network;
    // Remove "active" class from all images
    var allImages = document.querySelectorAll('.imgicon img');
    allImages.forEach(img => img.classList.remove('active'));

    // Add "active" class to the clicked image
    var clickedImage = event.target;
    clickedImage.classList.add('active');
    fromChain = network;
}

function btn1() {
    document.getElementById('step1').style.display = 'none';
    document.getElementById('btn1').style.display = 'none';
    document.getElementById('step2').style.display = 'block';
}

function selectNetwork2(network) {
    document.getElementById('btn2').style.display = 'block';
    document.getElementById('btn2').innerText = "Continue with " + network;
    // Remove "active" class from all images
    var allImages = document.querySelectorAll('.imgicon img');
    allImages.forEach(img => img.classList.remove('active'));

    // Add "active" class to the clicked image
    var clickedImage = event.target;
    clickedImage.classList.add('active');
    toChain = network;
}

function btn2() {
    document.getElementById('step1').style.display = 'none';
    document.getElementById('btn2').style.display = 'none';
    document.getElementById('step2').style.display = 'none';
    document.getElementById('step3').style.display = 'block';
}

function showInputField() {
    document.getElementById('networkSelection').style.display = 'none';
    document.getElementById('inputField').style.display = 'block';
}

function debounce(func, delay) {
    let timer;
    return function (...args) {
        const context = this;
        clearTimeout(timer);
        timer = setTimeout(() => {
            func.apply(context, args);
        }, delay);
    };
}

document.getElementById('addressinput').addEventListener('input', debounce(async (e) => {
    recipientWallet = e.target.value;
    var submitButton = document.getElementById('btn3');
    if (e.target.value.trim() !== '') {
        submitButton.style.display = 'block';
    } else {
        submitButton.style.display = 'none';
    }
}, 300));

const isValidAddress = (value) => {
    if (typeof value == "string") {
        if (value != null && value != undefined && value != "") {
            const valRegex = /^(0x)?[0-9a-fA-F]{40}$/;
            const isValidString = valRegex.test(value);
            if (isValidString) {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    } else {
        return false;
    }
}

const submitForm = async () => {
    try {
        document.getElementById("btn3").style.display = "none";
        document.getElementById("loading").style.display = "block";
        if (fromChain) {
            if (toChain) {
                if (isValidAddress(recipientWallet)) {
                    document.getElementById("walletError").style.display = "none";
                    let myHeaders = new Headers();
                    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

                    let urlencoded = new URLSearchParams();
                    urlencoded.append("fromChain", fromChain);
                    urlencoded.append("toChain", toChain);
                    urlencoded.append("recipientWallet", recipientWallet);
                    urlencoded.append("chatId", chatId);

                    const requestOptions = {
                        method: 'POST',
                        headers: myHeaders,
                        body: urlencoded,
                        redirect: 'follow'
                    };

                    const response = await fetch(`${baseUrl}/initiate-transaction`, requestOptions);
                    const result = await response.json();
                    if (result.success) {
                        document.getElementById("btn3").style.display = "none";
                        document.getElementById("step3").style.display = "none";
                        document.getElementById("loading").style.display = "none";
                        document.getElementById("step4").style.display = "block";
                    } else {
                        document.getElementById("errorMsg").style.display = "block";
                        document.getElementById("btn3").style.display = "block";
                        document.getElementById("loading").style.display = "none";
                    }
                } else {
                    document.getElementById("walletError").style.display = "block";
                    document.getElementById("btn3").style.display = "block";
                    document.getElementById("loading").style.display = "none";
                }
            } else {
                document.getElementById("errorMsg").style.display = "block";
                document.getElementById("btn3").style.display = "block";
                document.getElementById("loading").style.display = "none";
            }
        } else {
            document.getElementById("errorMsg").style.display = "block";
            document.getElementById("btn3").style.display = "block";
            document.getElementById("loading").style.display = "none";
        }
    } catch (error) {
        document.getElementById("errorMsg").style.display = "block";
        document.getElementById("btn3").style.display = "block";
        document.getElementById("loading").style.display = "none";
    }
}