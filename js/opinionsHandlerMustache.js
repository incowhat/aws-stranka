async function renderOpinions() {
    // var template
    // try {
    //     // console.log("Fetching template from:", templatePath);
    //     const response = await fetch('templates/form.html');
    //     if (!response.ok) {
    //         throw new Error(`HTTP error! status: ${response.status}`);
    //     }
    //     template = await response.text();
    // } catch (error) {
    //     console.error("Error loading template:", error);
    //     return "<p>Error loading template</p>";
    // }

    const opinions = JSON.parse(localStorage.getItem("opinions")) || [];
    const container = document.getElementById('mustache-container');
    const template = document.getElementById('mustache-template').innerHTML

    console.log(template)

    const renderedHtml = opinions.map(opinion => Mustache.render(template, opinion)).join('');
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