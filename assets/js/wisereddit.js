// the function to end all functions
// the function to be all functions
function app() {
    console.log('Running...');
    getComment();
    document.getElementById("next").addEventListener("click", getComment, false);
    setUpLoadingAnim();
}

// simple loading animation
function setUpLoadingAnim() {
  i = 0;
  setInterval(function() {
    i = ++i % 4;
    document.getElementById("loading").innerHTML = ("fetching");
  });
}

// get the mysterious and wise comment oh so graciously provided to us by the
// wise Reddit senpai
function getComment() {
  document.getElementById("snoo").className = "bloo"
  document.getElementById("next").className = "btnoff"
  document.getElementById("next").innerHTML = "<img src='assets/img/poweron.svg'>"
  document.getElementById("loading").style.visibility = "visible";
  document.getElementById("quote").style.visibility = "hidden";
  console.log('Fetching feed...');
   fetch('https://www.reddit.com/comments/.json')
    .then(status)
    .then(json)
    .then(getCommentsFromJSON)
    .then(addCommentstoHTML)
    .catch(function(error) {
      console.log('request failed', error)
    });
}

function status(response) {
  if (response.status >= 200 && response.status < 300) {
    return Promise.resolve(response)
  } else {
    return Promise.reject(new Error(response.statusText))
  }
}

function json(response) {
  return response.json()
}

// Make sure the comment isn't too long or isn't within an 18+ subreddit
// Not that the beautiful Reddit guru doesn't already know this
function getCommentsFromJSON(json) {
  console.log('Finding comments...');
  var text;
  var i = 0;
  do {
    text = json["data"]["children"][i]["data"]["body"];
    i++;
  } while (String(text).length > 80 || json["data"]["children"][0]["data"]["over_18"] == "true");

  return text;
}

function sleep (time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

//Drop the text into the HTML
//Scale text to fit div
function addCommentstoHTML(text) {
  console.log('Printing...');
  var quote = document.getElementById("quote");
  document.getElementById("loading").style.visibility = "hidden";
  document.getElementById("quote").style.visibility = "visible";
  document.getElementById("snoo").className = "snoo"
  document.getElementById("snoo").className = "pulse"
	quote.innerHTML = text;
  console.log('Speaking...');
  artyom.say(text);
  while(checkOverflow(quote)) {
    var fontSize = parseFloat(window.getComputedStyle(quote, null).getPropertyValue('font-size'));
    quote.style.fontSize = (fontSize - 2) + "px";
  }
  sleep(3000).then(() => {
    document.getElementById("next").innerHTML = "<img src='assets/img/poweroff.svg'>"
    document.getElementById("next").className = "btnon"
    document.getElementById("snoo").className = "pulsein"
    console.log('Done...');
  });
}

// determine if text is overflowing out of the div
function checkOverflow(el)
{
  var curOverflow = el.style.overflow;

  if ( !curOverflow || curOverflow === "visible" ) {
    el.style.overflow = "hidden";
  }

  var isOverflowing = el.clientWidth < el.scrollWidth || el.clientHeight < el.scrollHeight;
  el.style.overflow = curOverflow;

  return isOverflowing;
}

// so simple, so fragile
// be free little function
app();
