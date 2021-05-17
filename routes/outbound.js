import express from 'express'
import  { MessageModel}  from '../models/message.js'
import cache  from 'memory-cache'
import { cacheKeys } from './inbound.js';

const router = express.Router()


router.post('/outbound/sms', (req ,res )=>{
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

    if (cacheKeys[from] == to) {
        res.status(406).json({
            "message": "",
            "error": "sms from " + from + " to " + to + " is blocked by STOP request"
        })
        return
    } 
    const newSMS = MessageModel({
        from : from,
        to : to,
        text : text.toString()
    })

    newSMS.save((outboundError) => {
        if (outboundError) {
            res.status(500).json({
                "message": "",
                "error": "unknown failure"
            });
            console.log(outboundError)
        } else {
            res.status(201).json({
                "message": "outbound sms is ok",
                "error": ""
            });
        }
    });

})

export  { router as OutboundRouter }