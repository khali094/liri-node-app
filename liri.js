require("dotenv").config();

var keys = require("./keys.js");
var Twitter = require('twitter');
var Spotify = require('node-spotify-api');

var fs = require('fs');


var inquirer = require("inquirer");

inquirer.prompt([
  {
    type: "list",
    message: "Whats would you like to do?",
    choices: ["my-tweets", "spotify-this-song", "movie-this", "do-what-it-says"],
    name: "selections"
  },
  {
    type: "input",
    message: "input info",
    name: "info"
  },

  ]).then(function(confData){
  	// console.log(JSON.stringify(confData, null, 2));
  	
    if (confData.selections == "my-tweets") {
      console.log('')
  		console.log(' You selected: my-tweets');
  
  // all of the code for my-tweets goes here
        
        var client = new Twitter(keys.twitter);
         
        var params = {screen_name: confData.info , count: 20};
        client.get('statuses/user_timeline',params, function(error, tweets, response) {
          if (!error) {
             // console.log(tweets);
            for (var i = 0; i < tweets.length; i++) {
              console.log('')
              console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~')
            	console.log(' Tweet: ' + tweets[i].text)
              console.log('')
            	console.log(" Tweet Number: " + (i+1))
              console.log('')
            	console.log(' Created: ' + tweets[i].created_at)
              console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~')
              console.log('')
            }
          }
        });


  	} else if (confData.selections == "spotify-this-song") {
  		var spotify = new Spotify(keys.spotify);
      spotify.search({ type: 'track', query: confData.info}, function(err, data) {
			    if (err) {
			        console.log('Error occurred: ' + err);
			        return;
			    }

			    var song = data.tracks.items[0];
			    console.log("------Artists-----");
			    for(i=0; i<song.artists.length; i++){
			    	console.log(song.artists[i].name);
			    }

			    console.log("------Song Name-----");
			    console.log(song.name);

				console.log("-------Preview Link-----");
			    console.log(song.preview_url);

			    console.log("-------Album-----");
			    console.log(song.album.name);
				});
  
  // all of the spotify code will go here









  	} else if (confData.selections == "movie-this") {
      console.log('')
  		console.log(' You selected: movie-this');

  
  // all of the movie-this code goes here
	
	 request("https://api.themoviedb.org/3/search/movie?api_key=" + tmdbKey + "&query=" + confData.info, function(error, response, body) {

    // If there were no errors and the response code was 200 (i.e. the request was successful)...
    if (!error && response.statusCode === 200) {

      //console.log(JSON.parse(body));
      
      //Get the Movie ID
      var movieID =  JSON.parse(body).results[0].id;
      //console.log(movieID);

      //Create new query using the movie ID
      var queryURL = "https://api.themoviedb.org/3/movie/" + movieID + "?api_key=" + tmdbKey + "&append_to_response=credits,releases";

      request(queryURL, function(error, response, body) {
        var movieObj = JSON.parse(body);

        console.log("--------Title-----------");
        console.log(movieObj.original_title);

        console.log("--------Year -----------");
        console.log(movieObj.release_date.substring(0,4));

        console.log("--------Rating-----------");
        console.log(movieObj.releases.countries[0].certification);

        console.log("--------Country Produced-----------");
        for(i=0, j = movieObj.production_countries.length; i<j; i++){
          console.log(movieObj.production_countries[i].name);
        }
        console.log("--------Languages-----------");
        for(i=0, j = movieObj.spoken_languages.length; i<j; i++){
          console.log(movieObj.spoken_languages[i].name);
        }
        console.log("--------Plot----------------");
        console.log(movieObj.overview);

        console.log("--------Actors-----------");
        for(i=0, j = movieObj.credits.cast.length; i<j; i++){
          console.log(movieObj.credits.cast[i].name);
        }
        
      });


    }else{
      console.log(error);
    }

  });



  	} else if (confData.selections == "do-what-it-says") {
      fs.readFile('random.txt', 'utf8', function(err, data){

          if (err){ 
            return console.log(err);
          }

          var dataArr = data.split(',');

          processCommands(dataArr[0], dataArr[1]);
      });









  	} else {
      console.log('')
  		console.log(' i dont understand... you gave me bad input');
  	}
  });
