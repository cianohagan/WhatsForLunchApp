// Amazon Echo skill that returns lunch options to user on request
var alexa = require('alexa-app');
var slug = require('slug');

// Allow this module to be reloaded by hotswap when changed
module.change_code = 1;

// Define an alexa-app
var app = new alexa.app('canteen_menu');

var Client = require('node-rest-client').Client;

var client = new Client();

app.launch(function(request,response){
    var prompt = "Welcome. What would you like to know?";
    response.say(prompt).reprompt(prompt).shouldEndSession(false);
});


app.intent('lunchIntent', {
        "utterances": [
            "What's for lunch",
            "What is being served in the canteen today"
        ]
    }, function(request, response) {

    var url = "https://whatsforlunchapp.herokuapp.com/getMenu";

    client.get(url, function (lunch, callback) {
        // parsed response body as js object
        data = JSON.parse(lunch);
        if (data.soup1name != "Today's menu has not been uploaded yet."){
            var mainDishOne = data.main1name.replace("&", "and");
            var mainDishTwo = data.main2name.replace("&", "and");
            var mainDishVeg = data.vegname.replace("&", "and");
            var soupOne = data.soup1name.replace("&", "and");
            var soupTwo = data.soup2name.replace("&", "and");
            console.log(mainDishOne, mainDishTwo, mainDishVeg, soupOne, soupTwo);
            speechOutput = "The main dishes today are " + mainDishOne + " and " + mainDishTwo + ". The vegetarian option is " + mainDishVeg + ". Today's soups are " + soupOne + " and " + soupTwo;
            
            console.log(speechOutput);
            // This is async and will run after the http call returns
            response.say(speechOutput).shouldEndSession(true);
            // Must call send to end the original request 
            response.send();
        }
        else{
            speechOutput = "Today's menu has not been uploaded yet. Please try again later"
            console.log(speechOutput);
            // This is async and will run after the http call returns
            response.say(speechOutput).shouldEndSession(true);
            // Must call send to end the original request 
            response.send();
        }  
           
    }).on('error', function (err) {
        console.log('something went wrong on the request', err.request.options);
    });    

    // Return false immediately so alexa-app doesn't send the response
    return false;
});

app.intent('tomorrowLunchIntent', {
        "utterances": [
            "What is tomorrow's lunch",
            "What's tomorrow's lunch",
            "What is being served in the canteen tomorrow",
            "tomorrow",
            "tomorrow's menu",
            "tomorrow's lunch",
            "tomorrow lunch",
            "tomorrow menu",
            "What is for lunch tomorrow"
        ]
    }, function(request, response) {

    var url = "https://whatsforlunchapp.herokuapp.com/tomorrowMenu";

    client.get(url, function (lunch, callback) {
        // parsed response body as js object
        data = JSON.parse(lunch);
        if (data != "Data Unavailable"){
            var mainDishOne = data.main1name.replace("&", "and");
            var mainDishTwo = data.main2name.replace("&", "and");
            var mainDishVeg = data.vegname.replace("&", "and");
            var soupOne = data.soup1name.replace("&", "and");
            var soupTwo = data.soup2name.replace("&", "and");
            console.log(mainDishOne, mainDishTwo, mainDishVeg, soupOne, soupTwo);
            speechOutput = "Tomorrow's main dishes are " + mainDishOne + " and " + mainDishTwo + ". The vegetarian option is " + mainDishVeg + ". The soups will be " + soupOne + " and " + soupTwo;
            
            console.log(speechOutput);
            // This is async and will run after the http call returns
            response.say(speechOutput).shouldEndSession(true);
            // Must call send to end the original request 
            response.send();
        }
        else{
            speechOutput = "Tomorrow's menu has not been uploaded yet. Please try again later"
            console.log(speechOutput);
            // This is async and will run after the http call returns
            response.say(speechOutput).shouldEndSession(true);
            // Must call send to end the original request 
            response.send();
        } 
           
    }).on('error', function (err) {
        console.log('something went wrong on the request', err.request.options);
    });    

    // Return false immediately so alexa-app doesn't send the response
    return false;
});

app.intent('soupIntent', {
        "utterances": [
            "What are the soups",
            "Soup",
            "Soups",
            "What is the soup"
        ]
    }, function(request, response) {

    var url = "https://whatsforlunchapp.herokuapp.com/getMenu";

    client.get(url, function (lunch, callback) {
        // parsed response body as js object
        data = JSON.parse(lunch);
        if (data.soup1name != "Today's menu has not been uploaded yet."){
            slug.charmap['€'] = ''
            slug.charmap['.'] = 'euro'
            var soupOne = data.soup1name.replace("&", "and");
            var soupTwo = data.soup2name.replace("&", "and");
            var soupOnePrice = slug(data.soup1price);
            var soupTwoPrice = slug(data.soup2price);
            console.log(soupOne, soupTwo, soupOnePrice);
            if(soupOnePrice === soupTwoPrice){
                speechOutput = "Today's soups are " + soupOne + " and " + soupTwo + ". They are both priced at " + soupOnePrice;
            }
            else{
                speechOutput = "Today's soups are " + soupOne + " and " + soupTwo + ". The " + soupOne + " is priced at " + soup1price + " while the " + soupTwo + " is " + soupTwoPrice;
            }
            
            console.log(speechOutput);
            // This is async and will run after the http call returns
            response.say(speechOutput).shouldEndSession(true);
            // Must call send to end the original request 
            response.send(); 
        }
        else{
            speechOutput = "Today's menu has not been uploaded yet. Please try again later"
            console.log(speechOutput);
            // This is async and will run after the http call returns
            response.say(speechOutput).shouldEndSession(true);
            // Must call send to end the original request 
            response.send();
        } 

    }).on('error', function (err) {
        console.log('something went wrong on the request', err.request.options);
    });    

    // Return false immediately so alexa-app doesn't send the response
    return false;
});

app.intent('meatIntent', {
        "utterances": [
            "What are the meat dishes",
            "What is the meat dish",
            "meat",
            "main",
            "WHat are the main dishes"
        ]
    }, function(request, response) {

    var url = "https://whatsforlunchapp.herokuapp.com/getMenu";

    client.get(url, function (lunch, callback) {
        // parsed response body as js object
        data = JSON.parse(lunch);
        if (data.soup1name != "Today's menu has not been uploaded yet."){
            slug.charmap['€'] = ''
            slug.charmap['.'] = 'euro'
            var mainDishOne = data.main1name.replace("&", "and");
            var mainDishTwo = data.main2name.replace("&", "and");
            var mainOnePrice = slug(data.main1price);
            var mainTwoPrice = slug(data.main2price);
            console.log(mainDishOne, mainDishTwo, mainOnePrice);
            if(mainOnePrice === mainTwoPrice){
                speechOutput = "Today's meat dishes are " + mainDishOne + " and " + mainDishTwo + ". They are both priced at " + mainOnePrice;
            }
            else{
                speechOutput = "Today's meat dishes are " + mainDishOne + " and " + mainDishTwo + ". The " + mainDishOne + " is priced at " + mainOnePrice + " while the " + mainDishTwo + " is " + mainTwoPrice;
            }
            
            console.log(speechOutput);
            // This is async and will run after the http call returns
            response.say(speechOutput).shouldEndSession(true);
            // Must call send to end the original request 
            response.send(); 
        }
        else{
            speechOutput = "Today's menu has not been uploaded yet. Please try again later"
            console.log(speechOutput);
            // This is async and will run after the http call returns
            response.say(speechOutput).shouldEndSession(true);
            // Must call send to end the original request 
            response.send();
        } 
           
    }).on('error', function (err) {
        console.log('something went wrong on the request', err.request.options);
    });    

    // Return false immediately so alexa-app doesn't send the response
    return false;
});

app.intent('vegIntent', {
        "utterances": [
            "What are the vegetarian dishes",
            "What is the vegetarian dish",
            "vegetarian",
            "vegetable"
        ]
    }, function(request, response) {

    var url = "https://whatsforlunchapp.herokuapp.com/getMenu";

    client.get(url, function (lunch, callback) {
        // parsed response body as js object
        data = JSON.parse(lunch);
        if (data.soup1name != "Today's menu has not been uploaded yet."){
            slug.charmap['€'] = ''
            slug.charmap['.'] = 'euro'
            var mainDishVeg = data.vegname.replace("&", "and");
            var vegPrice = slug(data.vegprice);
            console.log(mainDishVeg, vegPrice);

            speechOutput = "Today's vegetarian dish is " + mainDishVeg + ". It is priced at " + vegPrice;

            
            console.log(speechOutput);
            // This is async and will run after the http call returns
            response.say(speechOutput).shouldEndSession(true);
            // Must call send to end the original request 
            response.send();
        }
        else{
            speechOutput = "Today's menu has not been uploaded yet. Please try again later"
            console.log(speechOutput);
            // This is async and will run after the http call returns
            response.say(speechOutput).shouldEndSession(true);
            // Must call send to end the original request 
            response.send();
        }  
           
    }).on('error', function (err) {
        console.log('something went wrong on the request', err.request.options);
    });    

    // Return false immediately so alexa-app doesn't send the response
    return false;
});

app.intent('tellMeMoreVegIntent', {
        "utterances": [
            "Tell me more about the vegetarian dishes",
            "Tell me more about the vegetarian dish",
        ]
    }, function(request, response) {

    var url = "https://whatsforlunchapp.herokuapp.com/getMenu";

    client.get(url, function (lunch, callback) {
        // parsed response body as js object
        data = JSON.parse(lunch);
        if (data.soup1name != "Today's menu has not been uploaded yet."){
            var mainDishVeg = data.vegname.replace("&", "and");
            var originalDesc = data.vegdesc;
            var kcalReplace = originalDesc.replace("Kcal", "calories");
            var vegDesc = kcalReplace.replace("&", "and");

            speechOutput = mainDishVeg + ". " + vegDesc;

            
            console.log(speechOutput);
            // This is async and will run after the http call returns
            response.say(speechOutput).shouldEndSession(true);
            // Must call send to end the original request 
            response.send();
        }
        else{
            speechOutput = "Today's menu has not been uploaded yet. Please try again later"
            console.log(speechOutput);
            // This is async and will run after the http call returns
            response.say(speechOutput).shouldEndSession(true);
            // Must call send to end the original request 
            response.send();
        }   
           
    }).on('error', function (err) {
        console.log('something went wrong on the request', err.request.options);
    });    

    // Return false immediately so alexa-app doesn't send the response
    return false;
});

app.intent('tellMeMoreMeatIntent', {
        "utterances": [
            "Tell me more about the meat dishes",
            "Tell me more about the meat dish",
            "Tell me more about the main dishes",
            "Tell me more about the main dish"
        ]
    }, function(request, response) {

    var url = "https://whatsforlunchapp.herokuapp.com/getMenu";

    client.get(url, function (lunch, callback) {
        // parsed response body as js object
        data = JSON.parse(lunch);
        if (data.soup1name != "Today's menu has not been uploaded yet."){
            var mainDishOne = data.main1name.replace("&", "and");
            var mainDishTwo = data.main2name.replace("&", "and");
            var originalDesc1 = data.main1desc.replace("Kcal", "calories");
            var mainOneDesc = originalDesc1.replace("&", "and");
            var originalDesc2 = data.main2desc.replace("Kcal", "calories");
            var mainTwoDesc = originalDesc2.replace("&", "and");

            speechOutput = mainDishOne + ". " + mainOneDesc + ". " + mainDishTwo + ". " + mainTwoDesc;

            console.log(speechOutput);
            // This is async and will run after the http call returns
            response.say(speechOutput).shouldEndSession(true);
            // Must call send to end the original request 
            response.send();
        }
        else{
            speechOutput = "Today's menu has not been uploaded yet. Please try again later"
            console.log(speechOutput);
            // This is async and will run after the http call returns
            response.say(speechOutput).shouldEndSession(true);
            // Must call send to end the original request 
            response.send();
        }    
           
    }).on('error', function (err) {
        console.log('something went wrong on the request', err.request.options);
    });    

    // Return false immediately so alexa-app doesn't send the response
    return false;
});

module.exports = app;

