const express = require("express");
const bodyParser = require("body-parser")
const {randomBytes} = require("crypto");
const axios = require('axios')
const morgan = require('morgan')
const app = express();

app.use(bodyParser.json());

app.use(morgan('dev'))



app.post('/events', async (req, res) => {
    try{
        console.log('event received with type',req.body.type);
        const {type,data}= req.body;
        if (type==='CommentCreated'){

            const status = data.content.includes('orange') ? 'rejected' :'approved';

            await  axios.post('http://event-bus-srv:4005/events',{
                type:"CommentModerated",
                data:{
                    id:data.id,
                    postId: data.postId,
                    status,
                    content: data.content
                }

                })
        }


        res.send({});
    }catch (e) {
        console.log(e.message);
        res.status(500).send({});
    }



});

app.listen(4003,()=>{
    console.log("moderation service is up and running in port 4003");
})