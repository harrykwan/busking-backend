var express =   require("express");

var googleIt = require('google-it')

const puppeteer = require('puppeteer');
var app     =   express();



app.get('/',function(req,res){
      res.sendFile(__dirname + "/index.html");
});

app.get('/googleit/:query',function(req,res){
  console.log(  req.params.query)


  googleIt({'query':   req.params.query+' chord'}).then(results => {
    // access to results object here
    // getpage(results[0].link,res)
    // getwebsite('https://zh-hk.guitarians.com/chord/86565/88VARGINA--%E8%AA%AA%E4%BA%86%E5%86%8D%E8%A6%8B',res)
    res.send(results)
  }).catch(e => {
    // any possible errors that might have occurred (like no Internet connection)
  })
});


app.get('/getchordpage/:query',function(req,res){
  console.log(  req.params.query)
  if (  req.params.query){
    var templink =   req.params.query
    templink = templink.split("|").join('/');
    getpage(templink,function(x){
      console.log(x)
      res.send(x)
    })
    // res.send(getpage(templink))
  } else
    res.send('no query')
});





function getpage(link,callback){
  if (link.indexOf('guitarians.com/chord')!=-1){
      return (async () => {
          const browser = await puppeteer.launch();
          const page = await browser.newPage();
          await page.goto(link);
          const pageresult = await page.evaluate(() => {
            return {
              text: document.getElementsByClassName('section-part')[0].innerText
            };
          });
          
          // console.log(pageresult.text);
          await browser.close();
          callback(pageresult.text)
        })();
  } else if (link.indexOf('polygonguitar.blogspot.com')!=-1||link.indexOf('daydayguitar.blogspot.com')!=-1){
      (async () => {
          const browser = await puppeteer.launch();
          const page = await browser.newPage();
          await page.goto(link);
          const pageresult = await page.evaluate(() => {
            return {
              text: document.getElementsByClassName('post-body')[0].innerText
            };
          });
        
          // console.log(pageresult.text);
          await browser.close();
          callback(pageresult.text)
        })();
  } else if (link.indexOf('blog.xuite.net')!=-1){
    return ;
      (async () => {
          const browser = await puppeteer.launch();
          const page = await browser.newPage();
          await page.goto(link);
          const pageresult = await page.evaluate(() => {
              var mytext = document.getElementsByClassName('blogbody')[0].innerText.split('--------------')[0]
              var mytext = document.body.innerHTML
            return {
              text: mytext
            };
          });
        
          // console.log(pageresult.text);
          await browser.close();
        })();
  } else if (link.indexOf('91pu.com')!=-1){
      (async () => {
          const browser = await puppeteer.launch();
          const page = await browser.newPage();
          await page.goto(link);
          const pageresult = await page.evaluate(() => {
              return {text: document.getElementsByClassName('tone')[0].innerText}
           
          });
        
          // console.log(pageresult.text);
          await browser.close();
          callback(pageresult.text)
        })();
  } else if (link.indexOf('tabs.ultimate-guitar.com')!=-1){
    (async () => {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.goto(link);
        const pageresult = await page.evaluate(() => {
            return {text: document.getElementsByTagName('code')[0].innerText}
         
        });
      
        // console.log(pageresult.text);
        await browser.close();
        callback(pageresult.text)
      })();
} else if (link.indexOf('chords-and-tabs.net')!=-1){
  (async () => {
      const browser = await puppeteer.launch();
      const page = await browser.newPage();
      await page.goto(link);
      const pageresult = await page.evaluate(() => {
          return {text: document.getElementsByClassName('contentdiv')[0].innerText}
       
      });
    
      // console.log(pageresult.text);
      await browser.close();
      callback(pageresult.text)
    })();
} else if (link.indexOf('polygon.guitars')!=-1){
      (async () => {
          const browser = await puppeteer.launch();
          const page = await browser.newPage();
          await page.goto(link);
          const pageresult = await page.evaluate(() => {
              var allline = document.getElementsByClassName('cnl_page')[0].getElementsByClassName('cnl_line');
              var tempresult = ''
              for (var j=0; j<allline.length; j++){
                  var tempallchord = allline[j].getElementsByClassName('chord')
                  for (var k=0; k<tempallchord.length; k++){
                      tempresult += tempallchord[k].innerText 
                  }
                  tempresult += '\n'
                  var tempalllyric = allline[j].getElementsByClassName('lyric')
                  for (var k=0; k<tempalllyric.length; k++){
                      tempresult += tempalllyric[k].innerText 
                  }
                  tempresult += '\n'
              }
              console.log(tempresult)
              return {
                  text: tempresult
              };
          });
          
          var tempresult = pageresult.text 
          for (var j=0; j<tempresult; j++){
              if (tempresult[j]=='\n'){
                  tempresult[j] = '\0'
              }
          }
          // console.log(tempresult);
          await browser.close();
          callback(tempresult)
        })();
  }

  
}

function replaceallline(x){
  while (x.indexOf('\n')!=-1){
      x = x.replace('\n','')
  }
  return x
}

app.listen(8001,function(){
    console.log("Working on port 8001");
});