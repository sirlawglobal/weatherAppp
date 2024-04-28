const http = require('http');
const routes = require("./routes");
const fs = require('fs');
const header = fs.readFileSync("./views/_head.html", {encoding: "utf-8"})
const footer = fs.readFileSync("./views/_footer.html", {encoding: "utf-8"})

const server = http.createServer(
                                    (Request , Response)=>{
                                    // Response.writeHead(200, {"Content-Type": "text/html"});
                                    // Response.write(header);

                                    // console.log(Request.url);
                                    if(Request.url === "/"){
                                        routes.home(Request,Response)      
                                    }
                                   
                                    else if(Request.url.indexOf("/", 1) === -1 || Request.url.slice(
                                                                                        Request.url.indexOf("/",1) + 1).length < 1
                                                                                              ) 

                                    {
                                     
                                      routes.search(Request, Response);
                                      // Response.end(footer)
                                    }
                                     else{
                                      Response.writeHead(200, {"Content-Type": "text/html"});
                                      Response.write(header);
                                      const error= fs.readFileSync("./views/error.html" ,{encoding: "utf-8"});
                                      Response.write(error);
                                      Response.end(footer)
                                    }
                                  }
                                )

server.listen(8080);