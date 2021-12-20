const Binance = require('node-binance-api');
const binance = new Binance().options({
  APIKEY: '',
  APISECRET: ''
});

var highs = [];
var closes = [];
var lows = [];
var hasBought = false;
var hasSold = true;
let quantity = 0.5;
var count = -1;
let ticker = 'SOLUSDT';
let timeFrame = '15m';

binance.websockets.candlesticks([ticker], timeFrame, (candlesticks) => {
  
  let { e:eventType, E:eventTime, s:symbol, k:ticks } = candlesticks;
  let { o:open, h:high, l:low, c:close, v:volume, n:trades, i:interval, x:isFinal, q:quoteVolume, V:buyVolume, Q:quoteBuyVolume } = ticks;
  console.log(symbol+" "+interval+" candlestick update");
  console.log("open: "+ open);
  console.log("high: "+ high);
  console.log("low: "+ low);
  console.log("close: "+ close);
  console.log("volume: "+ volume);
  console.log("isFinal: "+ isFinal);
  
  if (isFinal == true){
	  count++;
	  highs.push(parseFloat(high));
      closes.push(parseFloat(close));
      lows.push(parseFloat(low));
  }
 
  if (closes[count] > highs[count - 3]){
		if (hasSold == true){
		    console.log("buying");
			binance.marketBuy(ticker, quantity);
			hasBought = true;
			hasSold = false;
		}
  }
  
  if (closes[count] < lows[count - 3]){
	  if (hasBought == true){
	       console.log("selling");
	       binance.marketSell(ticker, quantity);
		   hasSold = true;
		   hasBought = false;
		}
  }
});