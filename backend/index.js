import express from "express";
const app=express()

import welcomerouter from "./Routes/Welcome.js";

app.use("/api",welcomerouter)

app.listen("3000",()=>{
    console.log("server running");
})