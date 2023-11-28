const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser')
const request = require("request");

require('dotenv').config()
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))


app.all("/*", (req, res) => {
    try {
        if(!req.query.url) return res.status(400).json({ code: "#Error", message: "URL is required" })
        const url = req.originalUrl.slice("/?url=".length).replace(/%20/g, "");
        if(!url) return res.status(400).json({ code: "#Error", message: "URL is required" })
        console.log({url})
        request(
            {
                url: url,
                method: req.method,
                json: req.body,
                headers: {
                    Authorization: req.header("Authorization"),
                    "User-Agent":
                        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36",
                },
                timeout: 10000,
                withCredentials: true,

            },
            function (error, response, body) {
                if (error) {
                    console.error("📢 error: " + error);
                    return res.status(500).json({ code: "#Error", message: error.message })
                }
            }
        ).pipe(res);
    } catch (error) {
        return res.status(500).json({ code: "#Error", message: error.message })
    }
});

app.use('*', (req, res) => {
    console.log("[log] Undocumented route")
    res.json({ code: "#Undocumented", message: "Nothing on this route yet" })
})


app.listen(process.env.PORT, () => {
    console.log("[log]: Server is up at PORT ", process.env.PORT)
})
