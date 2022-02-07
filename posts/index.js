const express =require('express');
const {randomBytes} = require('crypto')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const app = express();
const cors = require('cors')
const axios = require('axios')
app.use(morgan('dev'))
app.use(bodyParser.json())
app.use(cors())
const posts={};



app.post('/posts/create',async (req,res,next)=>{
    try{

        const id = randomBytes(4).toString('hex');
        const {title} = req.body;

        posts[id]={
            id,
            title
        }

        await axios.post('http://event-bus-srv:4005/events',{
            type:'PostCreated',
            data:{
                id,title
            }
        })
        res.status(201).send(posts[id]);
    }catch (e){
        console.log(e.message);
    }

})


app.post('/events',(req,res)=>{
    console.log('Received Event',req.body.type);

    res.send({});
})



app.listen(4000,()=>{
    console.log("v600");
    console.log('post service is up and running on port 4000');
})