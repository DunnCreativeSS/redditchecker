const request = require('request');
const $ = require('cheerio');
var ProxyLists = require('proxy-lists');
var GoogleSpreadsheet = require('google-spreadsheet');
var async = require('async');
var doc = new GoogleSpreadsheet('10o-Dmlj3nolgfTKtuasSfMZjGeBu5LvxLCgAMXSIUvg');
let sheet;
let sheet2;
let sheet3;
let redditsDone = []
let dates = []
let shares = []
async.series([
    function setAuth(step) {
        // see notes below for authentication instructions!
        var creds = require('../googlesheets.json');

        doc.useServiceAccountAuth(creds, step);
    },
    function getInfoAndWorksheets(step) {
        doc.getInfo(function(err, info) {
            console.log('Loaded doc: ' + info.title + ' by ' + info.author.email);
            sheet = info.worksheets[0];
            sheet2 = info.worksheets[1];
            sheet3 = info.worksheets[2]
            console.log('sheet 1: ' + sheet.title + ' ' + sheet.rowCount + 'x' + sheet.colCount);
            step();
        });
    },
    function workingWithRows(step) {

      sheet3.getRows(1, function (err, data){
        for(var row in data){
          shares.push(data[row].link)
      }
      console.log(shares)
    })
sheet2.getRows(1, function (err, data){
        for(var row in data){
          
          redditsDone.push(data[row].reddit)
          
        }

      sheet.getRows(1, function (err, data){
        for(var row in data){
          if (!redditsDone.includes(data[row].reddit)){
          dates.push(data[row].date)
          if (data[row].reddit.indexOf('reddit.co/') > 0){
            data[row].reddit = data[row].reddit.replace('reddit.co/', 'reddit.com/')
          }
          console.log(data[row].reddit)
          reddits.push(data[row].reddit)
        }

          
        }

      time = new Date().getTime();
      if (reddits.length > 0){
      doReddits(0)
      setTimeout(function(){
        resheet()
      }, 30 * 1000 * 60)
    }
    else {
      setTimeout(function(){
        resheet()
      }, 5 * 1000 * 60)
    }
    setTimeout(function(){
      newRows()
    }, 5000)
      })
      })

    }
]);
async function newRows(){

        var lineReader = require('readline').createInterface({
          input: require('fs').createReadStream('./reddits.txt')
        });

        lineReader.on('line', function (line) {
          if (!redditsDone.includes(line.replace('\n', '').replace('reddit.co/', 'reddit.com/')) && !reddits.includes(line.replace('\n', '').replace('reddit.co/', 'reddit.com/'))){
            sheet.addRow({'reddit': line.replace('\n', '').replace('reddit.co/', 'reddit.com/'), 'date' : new Date()}, function(){})

          }
        });
}
async function resheet(){

dates = []
shares = []
reddits = []
  sheet2.getRows(1, function (err, data){
        for(var row in data){
          
          redditsDone.push(data[row].reddit)
          
        }

      sheet.getRows(1, function (err, data){
        for(var row in data){
          if (!redditsDone.includes(data[row].reddit)){
            if (data[row].reddit.indexOf('reddit.co/') > 0){
            data[row].reddit = data[row].reddit.replace('reddit.co/', 'reddit.com/')
          }
          dates.push(data[row].date)
          reddits.push(data[row].reddit)
        }
          
        }
      time = new Date().getTime();
      if (reddits.length > 0){
      doReddits(0)
    }
    else {
      setTimeout(function(){
        resheet()
      }, 5 * 1000 * 60)
    }
      })
      })
}
let time;
let time2;

let reddits = []
let proxies = []
let gettingProxies;
var sources = ProxyLists.listSources();
var fs = require('fs');
let uas = []
fs.readFile( __dirname + '/ua.json', function (err, data) {
  if (err) {
    throw err; 
  }
  data = JSON.parse(data)
  for(var d in data){
  	if (data[d].commonality.toLowerCase() == 'common' || data[d].commonality.toLowerCase() == 'Very common'){
  		uas.push(data[d].ua)
  	}
  }
});
setInterval(function(){
fetchProxies()
}, 20000)
async function fetchProxies(){
	proxies = []
	try {
	var proxyoptions = {
	countries: ['us', 'ca'],
	sourcesWhiteList: [ 'proxies24',
  'gatherproxy',
  'proxylists-net',
  'sockslist',
  'hidemyname' ]

}
if (sources[source].name != 'bitproxies' && sources[source].name != 'kingproxies'){
	gettingProxies = ProxyLists.getProxies(proxyoptions);
	gettingProxies.on('error', function(error) {
	// Some error has occurred.
});
	
	gettingProxies.on('data', function(proxylist) {
		for (var proxy in proxylist){
			if (proxylist[proxy].protocols.includes('socks4') || proxylist[proxy].protocols.includes('socks5')){
			proxies.push(proxylist[proxy].ipAddress + ':' + proxylist[proxy].port)
		}
		}
	});
}
} catch (err){
}
}
let count = 0
let attempts = 0;
fetchProxies();
let proxy;
let proxyFirst = true;
async function doReddits(i){
var ua = uas[Math.floor(Math.random()*uas.length)];
if (proxyFirst){
proxy = proxies[Math.floor(Math.random()*proxies.length)];
proxyFirst = false;
}
let d = new Date().getTime();
console.log('d: ' + d)
let d2 = new Date(dates[i]).getTime()
console.log('d: ' + d2    )
let diff = (d - d2)
console.log(diff)
if ((diff) <( 1000 * 60 * 60 * 24 * 7) && !redditsDone.includes[reddits[i]]){
i++
if (i != reddits.length){
  setTimeout(function(){
    doReddits(i)
  }, Math.random() * 1000)
}
}
else if (reddits[i] != undefined){
console.log(reddits[i])
const options = {
	timeout: 5000,
  url: reddits[i],
  headers: {
    'User-Agent': ua
  },
  proxy: proxy
};

request.get(options, function(error, response, body){
    if(error) {
      console.log(error)
      proxy = proxies[Math.floor(Math.random()*proxies.length)];
        setTimeout(function(){
          if (count < 5){
            count++
      doReddits(i+1)
          }else {
            count =0
      doReddits(i+1)
          }
		}, Math.random() * 1000)
    } else {
    	console.log(' ')
    	
    	console.log(i)
    	
    	  console.log(reddits[i])
    	   let pass = 'bad'
         let href;
         for (var s in shares){
          console.log(shares[s])
          console.log(body.indexOf(shares[s]))
          if ((body.indexOf(shares[s])) >= 0){
            pass = 'good'
            href = shares[s]
          }
         }
         if (pass == 'bad' && attempts < 5){
         attempts++;
         proxy = proxies[Math.floor(Math.random()*proxies.length)];
         doReddits(i)
         }
         else {
         
         
  time2 = new Date().getTime()
  redditsDone.push(reddits[i])
  let diff = time2 - time
  time = time2
  let mins = diff / 1000 / 60
          sheet2.addRow({'attempts': attempts.toString(), 'minutes spent': mins, 'date checked' : new Date(),href: href, reddit: reddits[i],  result:pass}, function(){})

            attempts = 0;

console.log(' ')
i++
if (i != reddits.length){
	setTimeout(function(){
		doReddits(i)
	}, Math.random() * 1000)
}
  }
}
});
}
}

//#SHORTCUT_FOCUSABLE_DIV > div:nth-child(4) > div > div > div > div.s1ljaa4r-1.kgVjDg > div.s1ljaa4r-5.fmkWQd > div.sdccme-0.kIpPAE > div.uI_hDmU5GSiudtABRz_37.s5g80wy-2.laOlvl > div._2M2wOqmeoPVvcSsJ6Po9-V.s5g80wy-1.iXFIMi > div > div > p

