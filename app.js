const puppeteer = require('puppeteer')
const express = require('express')

const screenshot = 'debug.png';

const app = express();

var pm25Val = 0;
var avgPmVal = 0;

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
        pm25.then((result)=> {
            console.log("current: " + result);
            pm25Val = result;
        });
        var pm25Avg = page.$eval('#pm25Device', data => data.innerText);
        pm25Avg.then((result)=> {
            console.log("avg: " + result);
            avgPmVal = result;
        });
        
    }, 3000);
  await page.screenshot({ path: screenshot })
  console.log('logged in')
})()

app.get('/', (req, res) => {
        res.status(200).send({
            success: true,
            current: pm25Val,
            average: avgPmVal
        })
})

app.get("*", (req, res) => {
    res.status(404).json({"error": "not found"});
    res.end();
})

app.listen(3000, () => {
    console.log(`> Running on port 3000`);
})