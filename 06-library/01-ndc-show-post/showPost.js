// We can important site wide variables
// either through an IMPORT or a CLASS
import {
    SERVER,
    Utility
} from '../00-ndc-global/global.js';
import {
    CARD
} from '../00-ndc-global/shared-css.js';
console.log("[SERVER from import] " + SERVER);

class ShowPost extends HTMLElement {
    constructor() {
        super();
        console.log("CONSTRUCTOR...")
        this.ID;
        this.attachShadow({
            mode: 'open'
        });
        this.shadowRoot.innerHTML = `
        <style>
            ${CARD}
           
        </style>
        <!-- COMPONENT OUTPUT HERE -->
        <div id="info"></div>
    `;
    }
    static get observedAttributes() {
        return ["postid"];
    }
    attributeChangedCallback(name, oldValue, newValue) {
        // this will fire initially as the element has no atrribute but is added when page runs
        console.log("attribute has changed")
        if (oldValue === newValue) {
            return;
        }
        if (name === "postid") {
            console.log(name, oldValue, newValue);
            this.ID = newValue;
            this._getPosts(this.ID)
        }
    }
    connectedCallback() {
        // When component is added to DOM
        console.log("connectedCallback fired...");
    }
    disconnectedCallback() {
        // when component is removed from DOM
        console.log("Component removed - disconnectedCallback() fired...")
    }
    _getPosts(postID) {
        var utililityGetUrl = Utility.getUrl();
        console.log("url is " + utililityGetUrl);
        console.log(postID);
        console.log("[SERVER] " + SERVER);
        // let url = SERVER + 'wpb/wp-json/wp/v2/posts/' + postID;
        // let url = utililityGetUrl + 'wpb/wp-json/wp/v2/posts/' + postID;
        let url = '../_data/showPost' + postID + '.json';
        console.log(url);
        fetch(url)
            .then(res => res.json())
            .then(data => {
                console.log(data);
                let output = '<br>';
                // reference the output INFO element in this components Shadow DOM
                const info = this.shadowRoot.querySelector('#info');
                info.innerHTML = '<h3>URL: ' + url + '</h3>';
                output += '<div class="card">';
                output += 'PostID: <b>' + data.id + '</b><br> Title: <b>' + data.title.rendered + '</b><br> Author: ';
                output += '<b>' + data.authorName.toUpperCase() + '</b><br>';
                output += '<p>' + data.content.rendered + '</p>';
                output += '</div>';
                info.innerHTML += output;
            });
    }
    // we can mutate component via one of its (public) methods
    // we can also change the attribute within the component and this will re-render the component
    // we can also use getters and setters to do this (be wary of infinite loop)
    publicMethod(val) {
        // alert('[FN] Public Method in Web Component called...' + val);
        console.log("+++++++++++++++++++++++++");
        console.log('PUBLIC METHOD in Web Component called...[MESSAGE] => ' + val);
        console.log("+++++++++++++++++++++++++");
        // this._getPosts(40);
        // this.setAttribute('postid', 1142); // triggers attributeCallback lifecycle event
    }
}
customElements.define('show-post', ShowPost);