import router from "./routes.js";

document.addEventListener('DOMContentLoaded', function() {

    window.addEventListener('hashchange', () => {
        console.log("DOIN ROUTING from index.js")
        router.doRouting(window.location.hash);
    });

    // Add event listeners to your links (important for SPA navigation)
    // document.querySelectorAll('a').forEach(link => {
    //     // Check for local URLs to avoid binding to external links
    //     if (link.href.startsWith(window.location.origin)) {
    //         link.addEventListener('click', event => {
    //             event.preventDefault();  // Prevent default link behavior
    //             const newHash = new URL(event.currentTarget.href).hash;
    //             window.location.hash = newHash; // Update the hash, triggering hashchange
    //         });
    //     }
    // });
});