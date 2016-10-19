if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js').then(function(registration) {
    // Registration was successful
    console.log('ServiceWorker registration successful with scope: ', registration.scope);
  }).catch(function(err) {
    // registration failed :(
    console.log('ServiceWorker registration failed: ', err);
  });
}

//add simple support for background images:
document.addEventListener('lazybeforeunveil', function(e){
    var bg = e.target.getAttribute('data-bg');
    console.log(e);
    if(bg){
        e.target.style.backgroundImage = 'url(' + bg + ')';
    }
});

Handlebars.registerHelper("formatDate", function (datetime, format) {
    if (moment) {
        return moment(datetime).format(format);
    }
    else {
        return datetime;
    }
});

Handlebars.registerHelper("fromNow", function (datetime) {
    if (moment) {
        return moment(datetime).fromNow();
    }
    else {
        return datetime;
    }
});

Handlebars.registerHelper('text2html', function(description, options) {
    if(description != undefined){
        var urlRegex = /(https?:\/\/[^\s]+)/g;
        var html = description.replace(urlRegex, function(url) {
            return '<a target="_blank" href="' + url + '">' + url + '</a>';
        });
        return new Handlebars.SafeString(html.replace(/\n/ig,"<br/>"));
    }        
});

Handlebars.registerHelper('encodetext', function(text, options) {
    if(text != undefined){
        return new Handlebars.SafeString(encodeURI(text));
    }        
});

Handlebars.registerHelper('thisUrl', function(product, options) {
    return document.location.href;
});

(function (d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) { return; }
    js = d.createElement(s); js.id = id;
    js.src = "https://connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
} (document, 'script', 'facebook-jssdk'));

window.fbAsyncInit = function () {   
    FB.init({
        appId: '188510571271418',
        xfbml: true,
        version: 'v2.8'
    });

    var token = "188510571271418|6935eae5d8fb74dceb9a5d497204f14e";
    var source = document.getElementById("template").innerHTML;

    var eventID = document.location.search.slice(1);

        FB.api(
            "/"+eventID+"?&access_token=" + token + "&fields=interested_count,cover,description,id,category,name,start_time,place",
            function (response) {
                if (response && !response.error) {
                    document.title = response.name;
                    var template = Handlebars.compile(source);
                    var html = template(response);
                    document.getElementById("detail").innerHTML = html;
                }
            }
        );
};
