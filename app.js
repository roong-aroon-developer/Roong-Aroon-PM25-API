const express = require('express')
const request = require('request');

const app = express();

var data = {
    lastUpdate: 0,
    temp: 0,
    humid: 0,
    pm25: 0,
    pm25Avg: 0,
    pm10: 0,
    pm10Avg: 0,
    co2: 0
}

const options = {
    url: 'http://www.emtrontech.com/iaqnode/getSpecSiteData.php',
    json: true,
    form: {
        site: 24,
        siteType: 4
    }
};
setInterval(()=>{
    request.post(options, (err, res, body) => {
        if (err) {
            return console.log(err);
        }
        data.lastUpdate = body.d.lastUpdate
        data.temp = body.d.tempDevice
        data.humid = body.d.RhumidDevice
        data.pm25 = body.d.Rpm25Device
        data.pm25Avg = body.d.pm25Device
        data.pm10 = body.d.Rpm10Device
        data.pm10Avg = body.d.pm10Device
        data.co2 = body.d.Rco2Device
    });    
}, 3000)

app.get('/', (req, res) => {
    res.status(200).json({
        success: true,
        data: data
    })
})

app.listen(3000, () => {
    console.log(`Running on port 3000`);
})