import express from "express"
const welcomerouter=express.Router()

import {welcome} from "../Controllers/Welcome.js";

welcomerouter.get("/welcome",welcome)


export default welcomerouter;