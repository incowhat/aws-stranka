import Router from "./paramHashRouter.js";
import articleFormsHandler from "./articleFormsHandler.js";

const urlBase = "https://wt.kpi.fei.tuke.sk/api";
var pageNumber = 1;
var totalPages = 1;


export const Routes = [
    {
        hash: "welcome",
        target: "router-view",
        getTemplate: async (targetElm) => {
            const renderedTemplate = await fetchAndRenderTemplate('templates/welcome.html');
            document.getElementById(targetElm).innerHTML = renderedTemplate;
        }
    },
    {
        hash: "original-article1",
        target: "router-view",
        getTemplate: async (targetElm) => {
            const renderedTemplate = await fetchAndRenderTemplate('templates/article1.html');
            document.getElementById(targetElm).innerHTML = renderedTemplate;
        }
    },
    {
        hash: "original-article2",
        target: "router-view",
        getTemplate: async (targetElm) => {
            const renderedTemplate = await fetchAndRenderTemplate('templates/article2.html');
            document.getElementById(targetElm).innerHTML = renderedTemplate;
        }
    },
    {
        hash: "original-article3",
        target: "router-view",
        getTemplate: async (targetElm) => {
            const renderedTemplate = await fetchAndRenderTemplate('templates/article3.html');
            document.getElementById(targetElm).innerHTML = renderedTemplate;
        }
    },
    {
        hash: "writer",
        target: "router-view",
        getTemplate: async (targetElm) => {
            const renderedTemplate = await fetchAndRenderTemplate('templates/writer.html');
            document.getElementById(targetElm).innerHTML = renderedTemplate;
        }
    },
    {
        hash: "archive",
        target: "router-view",
        getTemplate: async (targetElm) => {
            const renderedTemplate = await fetchAndRenderTemplate('templates/archive.html');
            document.getElementById(targetElm).innerHTML = renderedTemplate;
        }
    },
    {
        hash: "addOpinion",
        target: "router-view",
        getTemplate: async (targetElm) => {
            const renderedTemplate = await fetchAndRenderTemplate('templates/welcome.html');
            document.getElementById(targetElm).innerHTML = renderedTemplate;
            // console.log("OPINIO ROUTE TEST");
            history.pushState(null, "", "#welcome");
            toggleForm();
        }
    },
    {
        hash: "opinions",
        target: "router-view",
        getTemplate: async (targetElm) => {
            const renderedTemplate = await fetchAndRenderTemplate('templates/welcome.html');
            document.getElementById(targetElm).innerHTML = renderedTemplate;
            history.pushState(null, "", "#welcome");
            toggleFormLib();
        }
    },
    {
        hash: "articles",
        target: "router-view",
        getTemplate: fetchAndDisplayArticles
    },
    {
        hash: "article",
        target: "router-view",
        getTemplate: fetchAndDisplayArticleDetail
    },
    {
        hash: "artEdit",
        target: "router-view",
        getTemplate: editArticle
    },
    {
        hash: "artDelete",
        target: "router-view",
        getTemplate: deleteArticle
    },
    {
        hash: "artInsert",
        target: "router-view",
        getTemplate: (targetElm) => {
            fetchAndDisplayArticles(targetElm, pageNumber, totalPages, false)
        }
    }
];

// Initialize the router AFTER Routes is defined
const router = new Router(Routes, "welcome");

export default router;


async function fetchAndRenderTemplate(templatePath) {
    try {
        const response = await fetch(templatePath);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.text(); // Return the raw HTML
    } catch (error) {
        console.error("Error loading template:", error);
        return "<p>Error loading template</p>";
    }
}

function limitContent(content, maxLength) {
    if (!content || typeof content !== 'string') {
        return ''; // Return empty string for invalid/empty input
    }

    // Remove any inline style size attributes, keeping other inline styles
    content = content.replace(/style="[^"]*font-size:[^"]*;"/gi, '');
    content = content.replace(/style='[^']*font-size:[^']*;'/, '');
    content = content.replace(/style="[^"]*font-size:[^"]*"/gi, '');
    content = content.replace(/style='[^']*font-size:[^']*'/, '');


    if (content.length <= maxLength) {
        return content;
    }
    const trimmedContent = content.substring(0, maxLength);
    const lastSpaceIndex = trimmedContent.lastIndexOf(' ');
    return lastSpaceIndex > 0 ? trimmedContent.substring(0, lastSpaceIndex) + '...' : trimmedContent + '...';
}

function fetchArticleContents(articles, targetElm, responseJSON, page, doHashChange) {
    let completedRequests = 0;
    if (articles.length === 0) {
        renderArticles(articles, targetElm, responseJSON, page, doHashChange)
    }

    articles.forEach((article, index) => {
        const contentUrl = `${urlBase}/article/${article.id}`;
        const contentAjax = new XMLHttpRequest();
        contentAjax.addEventListener("load", function () {
            if (this.status === 200) {
                const contentResponse = JSON.parse(this.responseText);
                // Limit the content to 100 characters, but don't split words
                articles[index].content = limitContent(contentResponse.content, 300);

                articles[index].author = contentResponse.author;

            } else {
                articles[index].content = "Failed to load content";
            }
            completedRequests++;
            if (completedRequests === articles.length) {
                renderArticles(articles, targetElm, responseJSON, page, doHashChange)
            }
        });

        contentAjax.open("GET", contentUrl, true);
        contentAjax.send();
    });
}

async function renderArticles(articles, targetElm, responseJSON, page, doHashChange = true) {
    responseJSON.articles = articles;
    let templates;
    try {
        const response = await fetch('templates/articles.html');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const html = await response.text();
        const parser = new DOMParser();
        templates = parser.parseFromString(html, "text/html");

        responseJSON.articles = responseJSON.articles.map(article => ({
            ...article,
            author: article.author && article.author !== "{{userName}}" ? article.author : "Anonymous" // Default to Anonymous if author is null
        }));
    } catch (error) {
        console.error("Error loading template:", error);
        document.getElementById(targetElm).innerHTML = "<p>Error loading template</p>";
    }

    document.getElementById(targetElm).innerHTML = Mustache.render(templates.getElementById("template-articles").innerHTML, responseJSON);
    if (doHashChange) {
        history.pushState(null, '', `#articles/${pageNumber}/${totalPages}`);
    }
    console.log("render done");
    const inputElement = document.getElementById('articlesPerPage');
    if (!doHashChange) {
        insertArticle(targetElm)
    } else {
        inputElement.addEventListener("change", function (event) {
            localStorage.setItem("articlesPerPage", event.target.value)
            window.location.hash = "articles"
            console.log("location hash updated")
        });
    }
}

function fetchAndDisplayArticles(targetElm, page, total, doHashChange = true) {
    pageNumber = Number(page) || 1
    totalPages = Number(total) || totalPages

    if (pageNumber > totalPages) {
        pageNumber = totalPages
    }

    console.log("page num and total and app:", pageNumber, totalPages)
    window.scrollTo({ top: 0, behavior: 'smooth' })

    const reqTotalFinder = new XMLHttpRequest();
    reqTotalFinder.open("GET", `${urlBase}/article?max=1`, true)

    reqTotalFinder.onload = function () {
        if (reqTotalFinder.status >= 200 && reqTotalFinder.status < 300) {
            console.log(this.responseText)
            const totalCountJson = JSON.parse(reqTotalFinder.responseText);
            const totalCount = totalCountJson.meta.totalCount;
            const articlesPerPage = localStorage.getItem('articlesPerPage') || 20;
            totalPages = Math.ceil(totalCount / articlesPerPage);

            const offset = totalCount - (articlesPerPage * pageNumber);
            let urlQuery
            if (offset < 0) {
                urlQuery = `?offset=0&max=${articlesPerPage + offset}`;
            } else {
                urlQuery = `?offset=${offset}&max=${articlesPerPage}`;
            }

            const reqArticles = new XMLHttpRequest();
            reqArticles.open("GET", `${urlBase}/article${urlQuery}`, true);


            reqArticles.onload = async function () { // render inside of articles req
                if (reqArticles.status == 200) {
                    console.log(this.responseText)
                    console.log("page num and total:", pageNumber, totalPages)
                    let responseJSON = JSON.parse(reqArticles.responseText)

                    responseJSON.articles.reverse();
                    addArtDetailLink2ResponseJson(responseJSON);

                    responseJSON.hasPrev = pageNumber > 1
                    responseJSON.hasNext = pageNumber < totalPages;
                    responseJSON.hasFirst = pageNumber > 1;
                    responseJSON.hasLast = pageNumber < totalPages;
                    responseJSON.articlesPerPage = articlesPerPage;
                    responseJSON.prevOffset = pageNumber - 1;
                    responseJSON.nextOffset = pageNumber + 1;
                    responseJSON.totalPages = totalPages;
                    fetchArticleContents(responseJSON.articles, targetElm, responseJSON, page, doHashChange);

                } else {
                    // Handle error for reqArticles
                    const errMsgObj = { errMessage: reqArticles.responseText };
                    console.log("ARTICLE LOADING ERROR")
                    document.getElementById(targetElm).innerHTML = Mustache.render(
                        document.getElementById("template-articles-error").innerHTML,
                        errMsgObj
                    )
                }
            }
            reqArticles.send()

        } else {
            // Handle error for reqTotalFinder
            const errMsgObj = { errMessage: reqTotalFinder.responseText };
            document.getElementById(targetElm).innerHTML = Mustache.render(
                document.getElementById("template-articles-error").innerHTML,
                errMsgObj
            )
        }
    }
    reqTotalFinder.send()
}

function addArtDetailLink2ResponseJson(responseJSON) {
    responseJSON.articles = responseJSON.articles.map(
        article => (
            {
                ...article,
                author: article.author && article.author !== "{{userName}}" ? article.author : "Anonymous",
                detailLink: `#article/${article.id}/${responseJSON.meta.offset}/${responseJSON.meta.totalCount}`,
                dateCreated: (new Date(article.dateCreated)).toLocaleString('sk-SK')
            }
        )
    );
}

function fetchAndDisplayArticleDetail(targetElm, artIdFromHash, offsetFromHash, totalCountFromHash) {
    fetchAndProcessArticle(...arguments, false);
}


function fetchAndProcessArticle(targetElm, artIdFromHash, offsetFromHash, totalCountFromHash, forEdit) {
    const url = `${urlBase}/article/${artIdFromHash}`;

    async function reqListener() {
        console.log(this.responseText);
        if (this.status == 200) {
            const responseJSON = JSON.parse(this.responseText);

            // Ensure 'content' property exists and is not null (add default string if needed)
            responseJSON.content = responseJSON.content || "";
            responseJSON.author = responseJSON.author || "Anonymous"; // New check here

            console.log(responseJSON.dateCreated)
            console.log(responseJSON.lastUpdated)
            if (responseJSON.lastUpdated && (responseJSON.lastUpdated != responseJSON.dateCreated)) {
                responseJSON.lastUpdated = (new Date(responseJSON.lastUpdated)).toLocaleString('sk-SK');
                responseJSON.isUpdated = true;
            } else {
                responseJSON.isUpdated = false;
            }

            responseJSON.dateCreated = (new Date(responseJSON.dateCreated)).toLocaleString('sk-SK'); // Added the formating of date

            if (forEdit) {
                // Ensure that imageLink and tags exist or set them to default string/array
                responseJSON.imageLink = responseJSON.imageLink || "";
                responseJSON.tags = responseJSON.tags ? responseJSON.tags.join(", ") : "";


                responseJSON.formTitle = "Article Edit";
                responseJSON.submitBtTitle = "Save article";
                responseJSON.backLink = `#article/${artIdFromHash}/${offsetFromHash}/${totalCountFromHash}`;

                renderArticleForm(responseJSON, forEdit, artIdFromHash, offsetFromHash, totalCountFromHash)
            } else {
                responseJSON.backLink = `#articles/${pageNumber}/${totalPages}`;
                responseJSON.editLink =
                    `#artEdit/${responseJSON.id}/${offsetFromHash}/${totalCountFromHash}`;
                responseJSON.deleteLink =
                    `#artDelete/${responseJSON.id}/${offsetFromHash}/${totalCountFromHash}`;

                let templates
                try {
                    const response = await fetch('templates/articles.html');
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    let html = await response.text();
                    const parser = new DOMParser()

                    templates = parser.parseFromString(html, "text/html")
                } catch (error) {
                    console.error("Error loading template:", error);
                    return "<p>Error loading template</p>";
                }


                document.getElementById(targetElm).innerHTML =
                    Mustache.render(
                        templates.getElementById("template-article").innerHTML,
                        responseJSON
                    );
                // Add link disabling toggle
                const articleElement = document.querySelector("#article-content");
                addLinkToggle(articleElement)
            }
        } else {
            responseJSON.backLink = `#articles/${offsetFromHash}/${totalCountFromHash}`;
            responseJSON.editLink =
                `#artEdit/${responseJSON.id}/${offsetFromHash}/${totalCountFromHash}`;
            responseJSON.deleteLink =
                `#artDelete/${responseJSON.id}/${offsetFromHash}/${totalCountFromHash}`;

            let templates
            try {
                const response = await fetch('templates/articles.html');
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                let html = await response.text();
                const parser = new DOMParser()

                templates = parser.parseFromString(html, "text/html")
            } catch (error) {
                console.error("Error loading template:", error);
                return "<p>Error loading template</p>";
            }

            document.getElementById(targetElm).innerHTML =
                Mustache.render(
                    templates.getElementById("template-article").innerHTML,
                    responseJSON
                );
        }
    }

    console.log(url);
    var ajax = new XMLHttpRequest();
    ajax.addEventListener("load", reqListener);
    ajax.open("GET", url, true);
    ajax.send();
}

function addLinkToggle(articleElement) {
    let linksDisabled = true;

    articleElement.addEventListener("click", function (event) {
        if (event.target.tagName === "A" && linksDisabled === true) {
            event.preventDefault();
        }
    });

    articleElement.addEventListener("contextmenu", function (event) {
        if (event.target.tagName === "A") {
            event.preventDefault();
            linksDisabled = !linksDisabled
            if (linksDisabled) {
                console.log("DISABLE ALL LINKS")
            } else {
                console.log("ENABLE ALL LINKS")
            }
        }
    })
}

function editArticle(targetElm, artIdFromHash, offsetFromHash, totalCountFromHash) {
    fetchAndProcessArticle(...arguments, true);
}

function deleteArticle(targetElm, artIdFromHash, offsetFromHash, totalCountFromHash) {
    const url = `${urlBase}/article/${artIdFromHash}`;


    const deleteReqSettings = {
        method: 'DELETE'
    };

    fetch(url, deleteReqSettings)
        .then(response => {
            if (response.ok) {
                window.alert("Article deleted successfully.");
            } else {
                return Promise.reject(new Error(`Server answered with ${response.status}: ${response.statusText}.`));
            }
        })
        .catch(error => {
            window.alert(`Failed to delete the article. ${error}`);
        })
        .finally(() => window.location.hash = `#articles/${pageNumber}/${totalPages}`); //back to the list of articles
}

async function insertArticle(targetElm) {
    const responseJSON = {
        formTitle: "Add New Article",
        submitBtTitle: "Save new article",
        backLink: `#articles`, //link for back button
        author: "", // add this
        title: "", // add this
        content: "", // add this
        imageLink: "", // add this
        tags: "" // add this
    };

    renderArticleForm(responseJSON, false)
}

async function renderArticleForm (responseJSON, editing=false, artIdFromHash='', offsetFromHash='', totalCountFromHash='') {
    let templates;
    try {
        const response = await fetch('templates/articles.html');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        let html = await response.text();
        const parser = new DOMParser()

        templates = parser.parseFromString(html, "text/html")
    } catch (error) {
        console.error("Error loading template:", error);
        return "<p>Error loading template</p>";
    }

    document.getElementById('article-form-container').innerHTML =
        Mustache.render(
            templates.getElementById("template-article-form").innerHTML,
            responseJSON
        );

    setTimeout(function () {
        let element = document.getElementById("article-i-div");
        let element2 = document.getElementById("article-i-background");
        let body = document.getElementById("body");
        element.classList.toggle("open-article-i");
        element2.classList.toggle("open-article-i");
        body.classList.add("open-article-i-body");
    }, 10);

    if (editing) {
        if (!window.artFrmHandler) {
            window.artFrmHandler = new articleFormsHandler("https://wt.kpi.fei.tuke.sk/api");
        }
        window.artFrmHandler.assignFormAndArticle("articleForm", "hiddenElm", artIdFromHash, offsetFromHash, totalCountFromHash);
    } else {
        if (!window.artFrmHandler) {
            window.artFrmHandler = new articleFormsHandler("https://wt.kpi.fei.tuke.sk/api");
        }
        window.artFrmHandler.assignFormAndArticle("articleForm", "hiddenElm", -1, 0, 0); //articleId < 0 => new article

    }
}
