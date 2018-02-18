require("dotenv").config();

var keys = require("./keys.js");
var Twitter = require('twitter');
var Spotify = require('node-spotify-api');
var request = require("request")

var fs = require('fs');


var inquirer = require("inquirer");
function startLiri(){
  inquirer.prompt([
    {
      type: "list",
      message: "Whats would you like to do?",
      choices: ["my-tweets", "spotify-this-song", "movie-this", "do-what-it-says"],
      name: "selections"
    }

  ]).then(function(confData){
      if (confData.selections === "my-tweets") {
        console.log('')
    		console.log(' You selected: my-tweets');
        inquirer.prompt([
           {
              type: "input",
              message: "input twitter contact!",
              name: "info"
            }
        ])
        .then(function(res){
            var twitterAccount = res.info
            var client = new Twitter(keys.twitter);
             
            var params = {screen_name: twitterAccount , count: 20};
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
                startLiri();
              }
            });
        })
    	}if (confData.selections == "spotify-this-song") {

        inquirer.prompt([
           {
              type: "input",
              message: "input song!",
              name: "info1"
            }
        ])
        .then(function(res){
            var spotify = new Spotify(keys.spotify);
            var song = res.info1;
            spotify.search({ type: 'track', query: song}, function(err, data) {

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
                startLiri();
              });
        })        

    	}if (confData.selections == "movie-this") {
         inquirer.prompt([
           {
              type: "input",
              message: "input movie!",
              name: "info2"
            }
        ]).then(function(res){
            var query = res.info2.split(" ");
            request(`http://www.omdbapi.com/?t=${query}&y=&plot=short&apikey=trilogy`, 
            function(error, response, body) {
              var data = JSON.parse(body)
              if (!error && response.statusCode === 200 && data.Response != 'False') {
            
                var movie = {Title : data.Title,
                      Year: data.Year,
                      IMDB: data.Ratings[0].Value,
                      RT: data.Ratings[1].Value,
                      Country: data.Country,
                      Language: data.Language,
                      Plot: data.Plot,
                      Actors: data.Actors}
                console.log(
                ` Movie: ${movie.Title} \n Year: ${movie.Year} \n IMDB Rating: ${movie.IMDB} \n Rotten Tomatoes: ${movie.RT} \n Country: ${movie.Country} \n Language: ${movie.Language} \n Plot: ${movie.Plot} \n Actors: ${movie.Actors} \n  `
                )
                startLiri();
              }
            });
        })

     


      }if(confData.selections == "do-what-it-says"){
        fs.readFile('random.txt', 'utf8', function(err, contents) {
          if(err){
            console.log("error",err);
          }else{
            var contentArr = contents.split(",")
            song = contentArr[1].trim();
            console.log(song);
            var spotify = new Spotify(keys.spotify);
            spotify.search({ type: 'track', query: song}, function(err, data) {

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
                startLiri();
              });
          }
        })
        
      };
    });
}
startLiri()