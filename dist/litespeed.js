var request     = env.require("request"),
    response    = env.require("response"),
    router      = env.require("router"),
    view        = env.require("view"),
    App = function(){
        return{
            view:this.view,
            router:this.router
        }
    };
var environment;
var request = function() {

    var call = function(method, url, headers) {
        return new Promise(
            function(resolve, reject) {

                var xmlhttp = new XMLHttpRequest();

                xmlhttp.open(method, url, true);
                //xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");

                xmlhttp.onload = function() {
                    if (4 == xmlhttp.readyState && 200 == xmlhttp.status) {
                        resolve(xmlhttp.response);
                    }

                    reject(Error(xmlhttp.statusText));
                };

                // Handle network errors
                xmlhttp.onerror = function() {
                    reject(Error("Network Error"));
                };

                xmlhttp.send();
            }
        )
    };

    return {
        'get': function(url) {
            return call('GET', url, {})
        },
        'post': function(url, headers) {
            return call('POST', url, headers)
        },
        'put': function(url) {
            return call('PUT', url, {})
        },
        'delete': function(url) {
            return call('DELETE', url, {})
        }
    }
}();
/**
 * Created by eldadfux on 4/27/15.
 */

/**
 * Router
 *
 * Holds application states and match logic
 */
this.router = function() {
    var states = [];

    return {

        /**
         * State
         *
         * Adds a new application state.
         *
         * @param path string
         * @param template string
         * @param controller function
         * @returns this.router
         */
        state: function(path, template, controller) {

            /**
             * Validation
             */
            if(typeof path !== 'string') {
                throw new Error('var path must be of type string');
            }

            if(typeof template !== 'string') {
                throw new Error('var template must be of type string');
            }

            if(typeof controller !== 'function') {
                throw new Error('var controller must be of type function');
            }

            states[states.length++] = {/* string */ path: path, /* string */ template: template, /* function */ controller: controller};

            return this;
        },

        /**
         * Match
         *
         * Compare current location and application states to find a match.
         */
        match: function() {
            return states.forEach(function(value) {

                //var route = "/users/:uid/pictures/:eldad";
                var match   = new RegExp(window.location.origin + value.path.replace(/:[^\s/]+/g, '([\\w-]+)'));
                var url     = window.location.href;

                console.log(url.match(match));

                if(url.match(match)) {
                    return value;
                }

                return (states.firstChild) ? states.firstChild : null;
            });
        }
    }

}();
/**
 * View
 *
 * Manage application scopes and different views
 */
var view = function() {
    var comps = [];

    return {

        /**
         * Comp
         *
         * Adds a new comp definition to application comp stack.
         *
         * @param object
         * @returns this.view
         */
        comp: function(object) {

            if(typeof object !== 'object') {
                throw new Error('var object must be of type object');
            }

            comps[comps.length++] = object;

            return this;
        },

        /**
         * Render
         *
         * Render all view components in a given scope.
         *
         * @param scope
         * @returns this.view
         */
        render: function(scope) {

            var view = this;

            console.log(scope);
            comps.forEach(function(value) {
                var elements = scope.querySelectorAll(value.selector);

                for (var i = 0; i < elements.length; i++) {
                    var element = elements[i];

                    element.style.background    = '#'+Math.floor(Math.random()*16777215).toString(16);
                    element.style.opacity       = '.8';

                    http
                        .get(value.template)
                        .then(
                        function(data){
                            element.innerHTML = data;

                            // execute controller (IOC) TODO: use IOC instead of direct execution
                            value.controller(element);

                            // re-render specific scope
                            view.render(element);
                        },

                        function(error){ console.error("Failed!", error); }
                    );
                }
            });

            return this;
        }
    }
}();
var http = function() {

    /**
     *
     * @param method string
     * @param url string
     * @param headers string
     * @param body string
     * @returns Promise
     */
    var request = function(method, url, headers, body) {

        if(-1 == ['GET', 'POST', 'PUT', 'DELETE', 'TRACE', 'HEAD', 'OPTIONS', 'CONNECT', 'PATCH'].indexOf(method)) {
            throw new Error('var method must contain a valid HTTP method name');
        }

        if(typeof url !== 'string') {
            throw new Error('var url must be of type string');
        }

        if(typeof headers !== 'object') {
            throw new Error('var headers must be of type object');
        }

        if(typeof url !== 'string') {
            throw new Error('var url must be of type string');
        }

        return new Promise(
            function(resolve, reject) {

                var xmlhttp = new XMLHttpRequest();

                xmlhttp.open(method, url, true);

                for (var key in headers) {
                    if (headers.hasOwnProperty(key)) {
                        xmlhttp.setRequestHeader(key, headers[key]);
                    }
                }

                xmlhttp.onload = function() {
                    if (4 == xmlhttp.readyState && 200 == xmlhttp.status) {
                        resolve(xmlhttp.response);
                    }

                    reject(Error(xmlhttp.statusText));
                };

                // Handle network errors
                xmlhttp.onerror = function() {
                    reject(Error("Network Error"));
                };

                xmlhttp.send(body);
            }
        )
    };

    return {
        'get': function(url) {
            return request('GET', url, {}, '')
        },
        'post': function(url, headers, params) {
            return request('POST', url, {'Content-type': 'application/x-www-form-urlencoded'}, '')
        },
        'put': function(url) {
            return request('PUT', url, {}, '')
        },
        'delete': function(url) {
            return request('DELETE', url, {}, '')
        }
    }
}();