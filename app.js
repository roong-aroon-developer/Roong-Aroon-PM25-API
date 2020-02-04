const puppeteer = require('puppeteer')
const express = require('express')
const bodyParser = require('body-parser')
const ddos = require('ddos')

const screenshot = 'debug.png';

const app = express();
const Ddos = new ddos({
    burst: 30,
    limit: 30,
    maxCount: 80,
    checkInterval: 5,
    errormessage: "You have been blocked by attemped Too many requests"
})
app.use(Ddos.express);
app.use(bodyParser.urlencoded({
    extended: true
}));

var pm25Val = 0;
var avgPm25Val = 0;
var pm10Val = 0;
var avgPm10Val = 0;
var co2Val = 0;

(async () => {
  const browser = await puppeteer.launch({headless: true})
  const page = await browser.newPage()
  await page.goto('http://www.emtrontech.com/iaqnode/login.php')
  await page.type('#tuser', "admin")
  await page.type('#tpass', "12345678")
  await page.$eval('#loginBtn', elem => elem.click())
  await page.waitForNavigation()
  await page.goto('http://www.emtrontech.com/iaqnode/siteData.php?id=24&type=4&sName=รุ่งอรุณ')
  setInterval(() => {
        var pm25 = page.$eval('#Rpm25Device', data => data.innerText);
        var pm25Avg = page.$eval('#pm25Device', data => data.innerText);
        var pm10 = page.$eval('#Rpm10Device', data => data.innerText);
        var pm10Avg = page.$eval('#pm10Device', data => data.innerText);
        var co2 = page.$eval('#Rco2Device', data => data.innerText);
        
        pm25.then((result)=> {
            pm25Val = result;
        });
        pm25Avg.then((result)=> {
            avgPm25Val = result;
        });
        pm10.then((result)=> {
            pm10Val = result;
        });
        pm10Avg.then((result)=> {
            avgPm10Val = result;
        });
        co2.then((result)=> {
            co2Val = result;
        });
        
        
    }, 3000);
  await page.screenshot({ path: screenshot })
  console.log('logged in')
})()

app.get('/', (req, res) => {
        res.status(200).json({
            success: true,
            current_pm25: pm25Val,
            average_pm25: avgPm25Val,
            current_pm10: pm10Val,
            average_pm10: avgPm10Val,
            carbon_dioxide: co2Val
        })
})

app.get("*", (req, res) => {
    res.status(404).json({"error": "not found"});
    res.end();
})

app.listen(3000, () => {
    console.log(`Running on port 3000`);
})