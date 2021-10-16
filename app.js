require("dotenv").config()
const express = require("express")
const cors = require("cors")
const morgan = require("morgan")
const path = require("path")
const mongoose = require("mongoose")


const port = process.env.PORT
const statusCodes = require("./util/response-codes")
const healthResponseModel = require("./models/api/health-response.model")
const indexResponseModel = require("./models/api/index_response.model")
var app = express()

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

// application configurations
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cors())
app.use(morgan('tiny'))//logs request-endpoint and time taken
app.use(express.static(path.join(__dirname, 'public')))

// mongoose connection MONGO_DB_URL
//mongoose.connect("mongodb+srv://vertex:Vertex9539@cluster0.gn40a.mongodb.net/myFirstDatabase?retryWrites=true&w=majority")
mongoose.connect(process.env.MONGO_DB_URL)
        .then((result)=>{
            console.log("db connection success")
        })
        .catch(err =>{
            console.log("db connection error"+err)
        })


app.get("/api",(req,res)=>{
    res.status(statusCodes.ok)
    res.json(indexResponseModel())
    res.end()
})

//application health check
app.get('/api/health-check',(req,res)=>{
    res.status(statusCodes.ok)
    res.json(healthResponseModel())
    res.end()
})

//view routers
app.use("/",require("./view-routes/index"))

// api routers
app.use("/api/user",require("./api-routes/user.route"))
app.use("/api/token",require("./api-routes/token.route"))
app.use("/api/product",require("./api-routes/product.route"))
app.use("/api/inventory",require("./api-routes/inventory.route"))

//no router found will trigger this by default
app.all('*',(req,res)=>{
    res.render("error")
})


app.listen(port,()=>console.log(`\napplication is running at ${port}`))
