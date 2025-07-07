import arcjet, { detectBot, shield, tokenBucket } from '@arcjet/node'
import { ENV } from './env.js'


export const aj = arcjet({
    key:ENV.ARCJET_KEY,
    characteristics:['ip.src'],
    rules:[
        // shield protects your app from common attacks e.g. SQL injection, XSS, CSRF attacks
        shield({mode:'LIVE'}),

        // bot detection - block all bots except search engines
        detectBot({
            mode:'LIVE',
            allow:[
                'CATEGORY:SEARCH_ENGINE',
                // allow legitimate search engine bots
                // see full list at https://arcjet.com/bot-list
            ],
        }),

        tokenBucket({
            mode:'LIVE',
            refillRate:20, // tokens added per interval
            interval:10,   // interval in seconds (10 seconds)
            capacity:20    // maximum tokens in bucket 
        })
    ]
})