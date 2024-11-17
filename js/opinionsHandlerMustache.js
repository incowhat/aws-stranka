function renderOpinions() {
    const opinions = JSON.parse(localStorage.getItem("opinions")) || [];
    const opinionTemplate = document.getElementById('mustache-template').innerHTML;
    const container = document.getElementById('mustache-container');

    const renderedHtml = opinions.map(opinion => Mustache.render(opinionTemplate, opinion)).join('');
    container.innerHTML = renderedHtml;
}

// 1 feedback json {"name":"Meno",
//     "email":"email@gmail.com",
//     "url":"https://incowhat.github.io/awt-stranka/img/color_wheel480.png",
//     "text":"Looooong Teeeeeeext",
//     "color":"Zelená",
//     "keywords":"Blog",
//     "Submitted":"17. 11. 2024 0:05:32"
// }