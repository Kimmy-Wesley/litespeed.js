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