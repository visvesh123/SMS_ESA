import express from 'express'
import  { MessageModel}  from '../models/message.js'
import cache  from 'memory-cache'

const router = express.Router()

let cacheKeys = new Map() 
router.post('/inbound/sms' , (req, res)=>{

    let  { from , to , text  } = req.body
    // From validation 
    if(from){
        if (from.toString().length < 6 || from.toString().length > 16) {
            res.status(400).json({
                "message": "",
                "error": "parameter 'from' is invalid"
            })
            return
        }
    } else {
        res.status(400).json({
            "message": "",
            "error": "parameter 'from' is missing"
        })
        return

    }

    // To validation 

    if (to) {
        if (to.toString().length < 6 || to.toString().length > 16) {
            res.status(400).json({
                "message": "",
                "error": "parameter 'to' is invalid"
            })
            return ;
        }
    } else {
        res.status(400).json({
            "message": "",
            "error": "parameter 'to' is missing"
        })
        return ;
    } 

    // Text validation 
    if (text) {
        if (text.length < 1 || text.length > 120) {
            res.status(400).json({
                "message": "",
                "error": "parameter 'text' is invalid"
            })
            return
        }
    } else {
        res.status(400).json({
            "message": "",
            "error": "parameter 'text' is missing"
        })
        return ;
    }

    // Caching 
    if (text.includes("STOP") || text.includes("STOP\n") || text.includes("STOP\r") || text.includes("STOP\r\n")) {
        cache.put(from, to, 1.44e+7) 
        cacheKeys[from] = to

        console.log(cacheKeys)

        return;
    }

    const newSMS = MessageModel({
        from : from,
        to : to,
        text : text.toString()
    })

    newSMS.save((inboundError) => {
        if (inboundError) {
            res.status(500).json({
                "message": "",
                "error": "unknown failure"
            });
            console.log(inboundError)
        } else {
            res.status(201).json({
                "message": "inbound sms is ok",
                "error": ""
            });
        }
    });
    
} )


export  { router as InboundRouter , cacheKeys}