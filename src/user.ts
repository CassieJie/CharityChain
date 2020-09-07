import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

import Vue from "vue";
import UserApp from "./user.vue";

let app = new Vue({
    el: '#app',
    template: '<UserApp/>',
    components: {
        UserApp
    }
});