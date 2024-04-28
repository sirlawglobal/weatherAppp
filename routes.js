const fs = require("fs");
const qs = require("querystring");
const header = fs.readFileSync("./views/_head.html", {encoding: "utf-8"});
const footer = fs.readFileSync("./views/_footer.html", {encoding: "utf-8"});
const https = require("https")


const homeRoute = (Request, Response ) => {

  if(Request.method.toUpperCase() === "GET"){
    Response.writeHead(200, {"Contenet-Type": "text/html"});
    Response.write(header);
    console.log(Request.method);
    const home = fs.readFileSync("./views/home.html" ,{encoding: "utf-8"});
    Response.write(home);  
    Response.end();
  }
    else{
      let formData ={};
      Request.on("data" , (data) => {
       
        formData = qs.parse(data.toString());
        // console.log(formData.city);
        Response.writeHead(303, {"location": "/" + formData.city});
        Response.end(footer);
      })
    }
}


const searchRoute = (Request , Response) =>{
  Response.writeHead(200, {"Content-Type": "text/html"});
  Response.write(header);

  let result= fs.readFileSync("./views/result.html" ,{encoding: "utf-8"});
  // Response.write(result);
  const city = Request.url.split("/")[1];

  
const API_KEY= "92761e2b9d95a244e834ca63858c1e12";
const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`;

https.get(apiUrl, function(res) {

  let cityData = "";
 res.on("data", function(data) {
  cityData += data.toString();
 });

 res.on("end", ()=>{

  try{    
   
    const weatherData = JSON.parse(cityData.toString());

    const dataObj = {
         description :weatherData.weather[0].description,
         temperature : (weatherData.main.temp - 273).toFixed(1),
        country  :  weatherData.sys.country,
         cityName : weatherData.name,
         icon :weatherData.weather[0].icon
    }

    for (const prop in dataObj){
      result = result.replace(new RegExp("{{" + prop + "}}" , "g"), dataObj[prop])
    }
    Response.write(result);

    // const res = `${cityName} (${country}) : ${description}, ${temperature}C`
    // console.log(res);
  } 
    catch (err){
      let error= fs.readFileSync("./views/error.html" ,{encoding: "utf-8"});
      error = error.replace("{{errorMessage}}" , err.message)
      Response.write(error);
     
    }
    Response.end(footer)
      // console.log("an error just occured:  check your input")
    
  })
}).on('error' , function(e){
  let error= fs.readFileSync("./views/error.html" ,{encoding: "utf-8"});
  error = error.replace("{{errorMessage}}" , e.message)
  Response.write(error);
  Response.end(footer);
  
})
  //end
}

// const errorRoute = () =>{
  
// }



module.exports = {home: homeRoute , search: searchRoute};