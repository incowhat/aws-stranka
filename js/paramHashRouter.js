export default class ParamHashRouter {
    constructor(routes, inithash) {
        this.routes = []; // Initialize as an empty array
        this.inithash = inithash;

        // Set routes *after* the router is created (this is key!)
        this.setRoutes(routes); // NEW: Method to set routes

        //   window.addEventListener("hashchange", this.handleHashChange.bind(this));
        this.handleInitialRoute();
    }

    // New Method to set Routes
    setRoutes(routes) {
        this.routes = routes;  // Ensure this.routes is assigned after instantiation.
    }

    //   handleHashChange(event) {
    //     //   this.doRouting(window.location.hash);
    //   }

    handleInitialRoute() {
        const initialHash = window.location.hash || '#' + this.inithash; // Use default if no hash
        window.location.hash = initialHash;  // Force a hash change to trigger the routing logic
        this.doRouting(initialHash); // Route based on default hash if needed
    }

    doRouting(hash) {  // Takes the hash directly as a string
        if (hash) {
            console.log("Hash is", hash)
            hash = hash[0] === '#' ? hash.substr(1) : hash;
            const hashParts = hash.split("/");
            const matchingRoute = this.routes.find(route => route.hash === hashParts[0]);

            console.log("rvfuihgwuhi9rewvgyuvrgeywi")
            console.log(hashParts)
            if (matchingRoute) {
                hashParts.shift();
                matchingRoute.getTemplate(matchingRoute.target, ...hashParts);
            }

            // lebo add article toto da het
            let body = document.getElementById("body")
            body.classList.remove("open-article-i-body")
        }
    }
}
