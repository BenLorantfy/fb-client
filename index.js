
function loader(appId, optionsInput){
    var options = optionsInput || {};
    var timeout = setTimeout(function(){}, 0);
    var timeoutSeconds = options.timeout || 10;
    var rejected = false;
    delete options.timeout;

    return new Promise(function(resolve, reject){
        window.fbAsyncInit = function() {
            if(rejected) return;
            clearTimeout(timeout);

            FB.init(Object.assign({}, {
                appId            : appId,
                autoLogAppEvents : true,
                xfbml            : true,
                version          : 'v2.10' // Matches version in package.json
            }, options));
            FB.AppEvents.logPageView();

            resolve(FB);
        };

        (function(d, s, id){
            var js, fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) {return;}
            js = d.createElement(s); js.id = id;
            js.src = "//connect.facebook.net/en_US/sdk.js";
            fjs.parentNode.insertBefore(js, fjs);
        }(document, 'script', 'facebook-jssdk')); 

        timeout = setTimeout(function(){
            rejected = true;
            reject(new Error("Timed out while trying to load fb client"));
        },timeoutSeconds * 1000);
    });   
}

var promise = null;
function importer(appId, options){
    if(promise === null){
        promise = loader(appId, options);
    }

    return promise;
}

module.exports = importer;