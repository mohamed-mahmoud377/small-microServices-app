const express = require("express");
const bodyParser = require("body-parser");
const morgan = require('morgan');
const {randomBytes} = require("crypto");
const axios = require("axios");
const app = express();
const cors = require('cors');
app.use(bodyParser.json());
app.use(morgan("dev"));
commetsByPostId = {};
app.use(cors());

app.get("/posts/:id/comments/", (req, res, next) => {
    res.send(commetsByPostId[req.params.id] || []);
});

app.post("/posts/:id/comments/", async (req, res, next) => {
    try {
        const commentId = randomBytes(4).toString('hex');
        const {content} = req.body;
        const comments = commetsByPostId[req.params.id] || [];
        comments.push({id: commentId, content, status: 'pending'});
        commetsByPostId[req.params.id] = comments;
        console.log(commetsByPostId);
        await axios.post('http://event-bus-srv:4005/events', {
            type: 'CommentCreated',
            data: {
                id: commentId, content,
                postId: req.params.id,
                status: 'pending'

            }
        });


        res.status(201).send(comments);
    } catch (e) {
        console.log(e.message);
        res.status(500);
    }

});

app.post('/events', async (req, res) => {
    try{
        console.log('Received Event', req.body.type);
        const {type, data} = req.body;
        if (type === "CommentModerated") {
            const {postId,id,status,content} = data;
            const comments = commetsByPostId[postId];
            const comment = comments.find(comment=>{
                return comment.id ===id;
            })
            comment.status =status;
            await axios.post('http://event-bus-srv:4005/events',{
                type:"CommentUpdated",
                data:{
                    postId,id,status,content
                }
            })

        }

        res.status(200).send({});
    }catch (e){
        console.log(e);
        res.status(500).send({});
    }

});

app.listen(4001, () => {
    console.log('comments service is up and running on port 4001');
});