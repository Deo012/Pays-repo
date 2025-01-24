const express = require("express");
const fetch = require("node-fetch");
const cors = require("cors");

const app = express();
const port = 3001;
const UNSPLASH_ACCESS_KEY = "gZNhoxJTijSsqD8yzs9CXXkU9lLpBBOt3mR_Inw0qXY";

app.use(cors());

//will be finished later is for proxy for unsplash