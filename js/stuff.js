function openForm() {
    let element = document.getElementById("form-div");
    let body = document.getElementById("body");
    element.classList.toggle("open-form");
    body.classList.toggle("open-form-body");
}

function validateForm() {
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const urlInput = document.getElementById('url');
    const textInput = document.getElementById('text');
    const legend = document.getElementById('legend');
    const radioGroup = document.getElementById('radios');
    const radioButtons = radioGroup.querySelectorAll('input[type="radio"]');
    const gdprDiv = document.getElementById('gdpr-div');
    const gdprInput = gdprDiv.querySelectorAll('input[type="checkbox"]');


    var isvalid = true;

    legend.classList.add('legend-show');
    
    if (!nameInput.value.trim()) {
        nameInput.classList.remove('good');
        nameInput.classList.add('required');
        isvalid = false;
    } else {
        nameInput.classList.remove('required');
        nameInput.classList.add('good');
    }
    
    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    if (!emailInput.value.trim()) {
        emailInput.classList.remove('good');
        emailInput.classList.remove('invalid');
        emailInput.classList.add('required');
        isvalid = false;
    } else if (!emailRegex.test(emailInput.value.trim())) {
        emailInput.classList.remove('good');
        emailInput.classList.remove('required');
        emailInput.classList.add('invalid');
        isvalid = false;
    } else {
        emailInput.classList.remove('required');
        emailInput.classList.remove('invalid');
        emailInput.classList.add('good');
    }
    
    const urlRegex = /(http(s?):)([/|.|\w|\s|-])*\.(?:jpg|gif|png|webp)/;
    if (!urlInput.value.trim()) {
        urlInput.classList.remove('good');
        urlInput.classList.remove('invalid');
        urlInput.classList.add('unrequired');
    } else if (!urlRegex.test(urlInput.value.trim())) {
        urlInput.classList.remove('good');
        urlInput.classList.remove('unrequired');
        urlInput.classList.add('invalid');
        isvalid = false;
    } else {
        urlInput.classList.remove('unrequired');
        urlInput.classList.remove('invalid');
        urlInput.classList.add('good');
    }
    
    if (!textInput.value.trim()) {
        textInput.classList.remove('good');
        textInput.classList.add('required');
        isvalid = false;
    } else {
        textInput.classList.remove('required');
        textInput.classList.add('good');
    }
    
    radioGroup.classList.add('unrequired');
    // var radioValid = false;
    for (const radioButton of radioButtons) {
        if (radioButton.checked) {
            radioGroup.classList.remove('unrequired');
            radioGroup.classList.add('good');
            console.log("test");
            // radioValid = true;
            break;
        }
    }
    // isvalid = isvalid && radioValid

    if (gdprInput[0].checked) {
        gdprDiv.classList.remove('required');
        gdprDiv.classList.add('good');
    } else {
        gdprDiv.classList.remove('good');
        gdprDiv.classList.add('required');
        isvalid = false;
    }
    
    return isvalid;
}

function resetForm() {
    const nameInput = document.getElementById('name');
    nameInput.classList.remove('good');
    nameInput.classList.remove('required');
    const emailInput = document.getElementById('email');
    emailInput.classList.remove('good');
    emailInput.classList.remove('required');
    emailInput.classList.remove('invalid');
    const urlInput = document.getElementById('url');
    urlInput.classList.remove('invalid');
    urlInput.classList.remove('unrequired');
    urlInput.classList.remove('good');
    const textInput = document.getElementById('text');
    textInput.classList.remove('required');
    textInput.classList.remove('good');
    const radioGroup = document.getElementById('radios');
    radioGroup.classList.remove('unrequired');
    radioGroup.classList.remove('good');
    const gdprDiv = document.getElementById('gdpr-div');
    gdprDiv.classList.remove('required');
    gdprDiv.classList.remove('good');
    const legend = document.getElementById('legend');
    legend.classList.remove('legend-show');
}

function toggleDarkMode() {
    const isDarkMode = localStorage.getItem('isDarkMode') === 'true';
    const root = document.documentElement;
  
    if (isDarkMode) {
      root.removeAttribute('data-color-scheme');
      localStorage.setItem('isDarkMode', 'false');
    } else {
        root.setAttribute('data-color-scheme', 'dark');
        localStorage.setItem('isDarkMode', 'true');
    }
}
  
    // Initial check for the user's preferred color scheme
window.onload = () => {
    const isDarkMode = localStorage.getItem('isDarkMode') === 'true';
    if (isDarkMode) {
      document.documentElement.setAttribute('data-color-scheme', 'dark');
    }
};