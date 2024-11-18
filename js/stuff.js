function toggleForm() {
    let element = document.getElementById("form-div");
    let element2 = document.getElementById("form-background");
    let body = document.getElementById("body");
    element.classList.toggle("open-form");
    element2.classList.toggle("open-form");
    body.classList.toggle("open-form-body");
}

function toggleFormLib() {
    let element = document.getElementById("form-lib-div");
    let element2 = document.getElementById("form-background");
    let body = document.getElementById("body");
    element.classList.toggle("open-form");
    element2.classList.toggle("open-form");
    body.classList.toggle("open-form-body");
    renderOpinions();
}

function processFormData() {
    const form = document.querySelector('.form-form');
    const newOpinion = {};
  
    for (const element of form.elements) {
      if (element.type === 'radio') {
        if (element.checked) {
            // Value je podla labelu pod danym inputom
            // this bol smart shit takze to tu necham
            // newOpinion[element.name] = document.getElementsByClassName(element.id)[0].textContent;
            newOpinion[element.name] = element.id;
        }
      } else {
        if (element.name == 'gdpr') {
            break;
        }
        // gpr netreba ukladat lebo je povinny, ostatne elementy za gdpr su reset button ktory je empty
        newOpinion[element.name] = element.value;
      }
    }
    newOpinion['color'] = newOpinion['color'] || '';
    newOpinion['submitted'] = new Date().toLocaleString("sk-SK");
  
    // checknutie newOpinion v konzole
    console.log(JSON.stringify(newOpinion));

    // bud fetchne opinions alebo vytvori novy list
    let opinions = JSON.parse(localStorage.getItem("opinions")) || [];
    opinions.push(newOpinion);
    // ulozi updated opinions list
    localStorage.setItem("opinions", JSON.stringify(opinions));

    // test
    console.log(opinions);
    // event.preventDefault();
}

function validateForm() {
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const urlInput = document.getElementById('url');
    const textInput = document.getElementById('text');
    const legend = document.getElementById('legend');
    const radioGroup = document.getElementById('radios');
    const radioButtons = radioGroup.querySelectorAll('input[type="radio"]');
    const keywordsInput = document.getElementById('keywords');
    const gdprDiv = document.getElementById('gdpr-div');
    const gdprInput = gdprDiv.querySelectorAll('input[type="checkbox"]');
    const magic = document.getElementById('magic')

    var isValid = true;


    legend.classList.add('legend-show');
    legend.classList.remove('legend-hide');
    magic.scrollTo({
        top: magic.scrollHeight,
        behavior: 'smooth'
    });
    
    if (!nameInput.value.trim()) {
        nameInput.classList.remove('good');
        nameInput.classList.add('required');
        isValid = false;
    } else {
        nameInput.classList.remove('required');
        nameInput.classList.add('good');
    }
    
    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    if (!emailInput.value.trim()) {
        emailInput.classList.remove('good');
        emailInput.classList.remove('invalid');
        emailInput.classList.add('required');
        isValid = false;
    } else if (!emailRegex.test(emailInput.value.trim())) {
        emailInput.classList.remove('good');
        emailInput.classList.remove('required');
        emailInput.classList.add('invalid');
        isValid = false;
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
        isValid = false;
    } else {
        urlInput.classList.remove('unrequired');
        urlInput.classList.remove('invalid');
        urlInput.classList.add('good');
    }
    
    if (!textInput.value.trim()) {
        textInput.classList.remove('good');
        textInput.classList.add('required');
        isValid = false;
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
    // isValid = isvalid && radioValid
    
    if (!keywordsInput.value.trim()) {
        keywordsInput.classList.remove('good');
        keywordsInput.classList.add('unrequired');
    } else {
        keywordsInput.classList.remove('unrequired');
        keywordsInput.classList.add('good');
    }

    if (gdprInput[0].checked) {
        gdprDiv.classList.remove('required');
        gdprDiv.classList.add('good');
    } else {
        gdprDiv.classList.remove('good');
        gdprDiv.classList.add('required');
        isValid = false;
    }
    

    if (isValid) {
        processFormData();
    }
    return isValid;
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
    const keywordsInput = document.getElementById('keywords');
    keywordsInput.classList.remove('unrequired');
    keywordsInput.classList.remove('good');
    const gdprDiv = document.getElementById('gdpr-div');
    gdprDiv.classList.remove('required');
    gdprDiv.classList.remove('good');
    const legend = document.getElementById('legend');
    legend.classList.remove('legend-show');
    legend.classList.add('legend-hide');
}


function toggleDarkMode() {
    const DarkModeOn = localStorage.getItem('DarkModeOn') === 'true';
    const root = document.documentElement;
  
    if (DarkModeOn) {
      root.removeAttribute('data-color-scheme');
      localStorage.setItem('DarkModeOn', 'false');
    } else {
        root.setAttribute('data-color-scheme', 'dark');
        localStorage.setItem('DarkModeOn', 'true');
    }
}

// Initial check for the user's preferred color scheme
window.onload = () => {
    const DarkModeOn = localStorage.getItem('DarkModeOn') === 'true';
    if (localStorage.getItem('DarkModeOn') === null) {
        DarkModeOn = window.matchMedia('(prefers-color-scheme: dark)').matches
    }
    if (DarkModeOn) {
        document.documentElement.setAttribute('data-color-scheme', 'dark');
        localStorage.setItem('DarkModeOn', 'true');
    }
};