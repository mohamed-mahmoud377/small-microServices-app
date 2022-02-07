const express = require("express");
const bodyParser = require("body-parser")
const {randomBytes} = require("crypto");
const axios = require('axios')
const morgan = require('morgan')
const app = express();

app.use(bodyParser.json());
const events = [];
app.use(morgan('dev'))
app.post('/events',(async (req, res, next) => {
    try {
        const event = req.body;
        const arr = [];
        events.push(event);
        console.log('sending event');
        arr.push(axios.post('http://posts-clusterip-srv:4000/events', event))
        arr.push(axios.post('http://comments-srv:4001/events', event))
        arr.push(axios.post('http://query-srv:4002/events', event))
        arr.push(axios.post('http://moderation-srv:4003/events', event))


        await Promise.all(arr);


        res.send({status:'OK'});
    }catch (e) {
        console.log(e.message);
    }




}))

app.get('/events',(req,res)=>{
    res.send(events);
})


app.listen(4005,()=>{
    console.log("event bus is up and running on port 4005");
})