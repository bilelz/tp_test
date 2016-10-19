var pagesList = ["fcbarcelona","EnglandTeam","remixjobs"];

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
    if(bg){
        e.target.style.backgroundImage = 'url(' + bg + ')';
    }
});

Handlebars.registerHelper("formatDate", function (datetime, format) {
    if(moment){
        return moment(datetime).format(format);
    }else{
        return datetime;
    }
});

Handlebars.registerHelper("fromNow", function (datetime) {
    if (moment){
        return moment(datetime).fromNow();
    }else {
        return datetime;
    }
});

Handlebars.registerHelper('encodetext', function(text, options) {
    if(text != undefined){
        return new Handlebars.SafeString(encodeURI(text));
    }        
});

Handlebars.registerHelper('getHashUrl', function(product, options) {
    var hashUrl = encodeURI(product.name).replace(/\//ig,'\\')+'/'+moment(product.start_time).format("dd")+'/'+moment(product.start_time).format("DD")+'/'+moment(product.start_time).format("MMM");
    if(product.place != undefined){
        hashUrl += '/'+encodeURI(product.place.name).replace(/\//ig,'\\');
    }else{
        hashUrl += '/';   
    }
    return hashUrl;
});

(function (d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) { return; }
    js = d.createElement(s); js.id = id;
    js.src = "https://connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
} (document, 'script', 'facebook-jssdk'));

window.fbAsyncInit = function () {

    var todayTimestamp = Math.round((new Date()).setHours(0,0,0,0) / 1000);
    FB.init({
        appId: '188510571271418',
        xfbml: true,
        version: 'v2.8'
    });

    var token = "188510571271418|6935eae5d8fb74dceb9a5d497204f14e";
    var eventList = [];
    var source = document.getElementById("template").innerHTML;
    var nbTotalResponse = 0;
    var template = Handlebars.compile(source);

    for(var i=0;i<pagesList.length;i++){
        FB.api(
            "/"+pagesList[i]+"/events?&access_token=" + token + "&fields=cover,description,id,category,name,start_time,place&since=" + todayTimestamp,
            function (response) {
                if (response && !response.error) {
                    nbTotalResponse++;
                    eventList = eventList.concat(response.data);
                    eventList.sort(function (a, b) {
                        return ((new Date(a.start_time)).getTime() - (new Date(b.start_time)).getTime());
                    });                   
                    
                    document.getElementById("eventList").innerHTML = template(eventList);
                    
                    /*if(nbTotalResponse == pagesList.length){
                        html = template(eventList);
                        document.getElementById("eventList").innerHTML = template(eventList);
                    }*/    
                }
            }
        );
    }
};