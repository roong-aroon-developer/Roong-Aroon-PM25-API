const express = require('express')
const fetch = require('node-fetch')
const ddos = require('ddos')
const bodyparser = require('body-parser')
const helmet = require('helmet')
const { URLSearchParams } = require('url');

const app = express();
const params = new URLSearchParams();

const Ddos = new ddos({
    burst: 30,
    limit: 30,
    maxCount: 80,
    checkInterval: 5,
    errormessage: "You have been blocked by attemped too many requests"
})

params.append('site', 24);
params.append('siteType', 4);
const settings = {
    method: 'POST', 
    body: params
}

app.use(Ddos.express)
app.use(bodyparser.urlencoded({
    extended: true
}));
app.use(bodyparser.json());
app.use(helmet());

app.get('/', async(req, res) => {
    
    fetch('http://www.emtrontech.com/iaqnode/getSpecSiteData.php', settings)
    .then(response => response.json())
    .then(data => res.status(200).json({
        success: true,
        lastUpdate: data.d.lastUpdate,
        temp: data.d.tempDevice,
        humidity: data.d.RhumidDevice,
        pm25: data.d.Rpm25Device,
        pm25Avg: data.d.pm25Device,
        pm10: data.d.Rpm10Device,
        pm10Avg: data.d.pm10Device,
        co2: data.d.Rco2Device
    }))
    
    
    
})

app.listen(3000, () => {
    console.log(`Running on port 3000`);
})