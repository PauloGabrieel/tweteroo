import express, { request, response } from "express";
import cors from "cors"



const app = express();
app.use(cors());
app.use(express.json());

const users = [];
const tweets = [];

app.post("/sign-up",(request,response)=>{
    const {username, avatar} = request.body;
    if(!username || !avatar){
        response.status(400).send("Todos os campos são obrigatórios");
        return;
    }
    users.push({
        username,
        avatar
    });
    response.status(201).send(users);
});

app.post("/tweets",(request, response)=>{
    const username = request.headers.user;
    const tweet = request.body.tweet;
    
    if(!tweet){
        response.status(400).send("Todos os campos são obrigatórios");
        return;
    }
    tweets.unshift({
        username,
        tweet
    });
    tweets.map(item =>{
    
        users.filter(user =>{
            if(user.username === item.username){
                item.avatar = user.avatar;
            };
        })
    });
    response.status(201).send(tweets);
});

app.get("/tweets/:username",(request,response)=>{
    const {username} = request.params;
    const userTweets = tweets.filter(tweet => tweet.username === username);
    response.send(userTweets);  
})

app.get("/tweets",(request, response)=>{
    const page = parseInt(request.query.page);
    const numberTweetsPerPage = 10;
    const startVisualization = (page * numberTweetsPerPage) - numberTweetsPerPage; 
    let endVisualization = page * numberTweetsPerPage;
    const newTweets = [];
    


    if(tweets.length === 0){
        response.status(200).send(newTweets);
        return;
    }

    if(!page || page < 1){
        response.status(400).send("Informe uma página válida!");
        return;
    };
    
    if(tweets.length < endVisualization){
        endVisualization = tweets.length;
    }
    
    for (let i = startVisualization ; i < endVisualization ; i++ ){
        newTweets.push(tweets[i]);
    };
    console.log(startVisualization);
    response.status(200).send(newTweets);

});


app.listen(5000);