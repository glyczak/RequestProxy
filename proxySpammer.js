const request = require("request");
const proxyLists = require("proxy-lists");

//NOTE: There WILL be duplicate proxies passed in the list.

// We only want plain old HTTP proxies.
const proxyOptions = {
    protocols: ['http']
};

// Let's fetch all of the proxies that match the above cases.
const fetchingProxies = proxyLists.getProxies(proxyOptions);

// This could (and probably will) use too many event listeners so let's raise the maximum amount.
fetchingProxies.setMaxListeners(64);

// Upon fetching the proxies, pass them to our request sender.
fetchingProxies.on('data', function(proxies) {
    proxies.forEach(sendRequest);
});

// Log any fetching errors.
fetchingProxies.on('error', function(error) {
    console.error(error);
});

// Send a request to the target through a supplied proxy.
function sendRequest(proxy) {
    const options = {
        proxy: `http://${proxy.ipAddress}:${proxy.port}`,
        method: 'GET',
        uri: 'http://api.ipify.org'
    };

    request(options, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            console.log(body);
        } else {
            // These errors can quickly become very annoying because many of the proxies will drop connection.
            //console.error(error);
        }
    });
}
