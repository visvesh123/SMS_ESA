import express from 'express'
import {InboundRouter}  from './routes/inbound.js'
import { OutboundRouter} from './routes/outbound.js'
import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config()
const app = express();



const port = process.env.PORT || 3000;
app.use(express.json());
app.use(InboundRouter);
app.use(OutboundRouter);

mongoose.connect(process.env.MONGO_URI , {
    useUnifiedTopology: true,
    useNewUrlParser: true
})


app.get('/', (req, res) => {
    res.send("SMS Microservice . PLease refer api's to work on ");
});

app.all('*', async  (req,res)=> {
    res.status(405).json({
        "message" : "Method not allowed"
    })
})

app.listen(port, () => {
    console.log(`Server running on port  ${port}`);
});

