 /// <summary>
 /// Develop a pure Node.js server application witch:
 ///        - listen at port number = 80;
 ///        - for each and every request that come thought HTTP the function() will be executed        
 /// </summary>

// Create the local instance of http module
var http = require("http");
// Create a QueryString instance
var qs = require("querystring");
// Create a StringBuilder instance
var StringBuilder = require("stringbuilder");
// Create the port where the http application listen
var port = 80; 

 /// <summary>
 /// Function getHome() => HomePage
 /// <param req> Request object /param>
 /// <param resp> Response object </param>
 /// </summary>
function getHome(req, resp)
{
    // Return the header on HTML format first, to let the browser now that the request was succesfully (200 = succesfully )
    resp.writeHead(200, { "Content-Type": "text/html" });
    // The HTML respons document that we sent back to the Client(browser)
    resp.write("<html><head><title>HomePage</title></head><body> Whant to do some calculation? Click <a href='/calc'>here</a></body></html>");
    //End listening this message = end the response
    resp.end();
}

/// <summary>
/// Function get404() => Resource Not Found
/// <param req>Request object</param>
/// <param resp>Response object</param>
/// </summary>
function get404(req, resp)
{
    // Return the message "Resource not found"
    resp.writeHead(404, "Resourse Not Found", { "Content-Type": "text/html" });
    // The HTML respons document that we sent back to the Client(browser)
    resp.write("<html><head><title>404</title></head><body>404 Resource not found. Go to <a href='/'>home</a></body></html>");
    // End listening this message = end the response
    resp.end();
}


/// <summary>
/// Function get405() => Method Not Supported
/// <param req>Request object</param>
/// <param resp>Response object</param>
/// </summary>
function get405(req, resp) {
    // Return the message "Methode Not Supported" 
    resp.writeHead(405, "Methode Not Supported" , { "Content-Type": "text/html" });
    // The HTML respons document that we sent back to the Client(browser)
    resp.write("<html><head><title>405</title></head><body>405 Method not supported. Go to <a href='/'>home</a></body></html>");
    //End listening this message = end the response
    resp.end();
}

/// <summary>
/// Function getCalcHtml() use 
/// <param req>Request object</param>
/// <param resp>Response object</param>
/// </summary>
function getCalcHtml(req, resp, data)
{
    // Create an instance og StringBuilder
    // Any line will be ended with "\r" or "\n"
    var sb = new StringBuilder({ newline: "\r\n" });
    // Writing the HTML message
    // I would like to have a Form with 2 text boxes and a Submit button
    //      - open a table : <table>....</table>
    //      -with rows: <tr>...</tr>
    //      -wth columns: <td>....</td>
    //
    sb.appendLine("<html>");
    sb.appendLine("<body>");
    // If the user click Submit button it needs to be proceded the request on form for POST method
    sb.appendLine("     <form method='post'>");
    sb.appendLine("         <table>");
    sb.appendLine("             <tr>");
    sb.appendLine("                 <td>Enter First No:</td>");

    if (data && data.txtFirstNo) {
        sb.appendLine("                 <td><input type='text' id='txtFirstNo' name='txtFirstNo' value='{0}' /></td>", data.txtFirstNo);
    }
    else
    {
        sb.appendLine("                 <td><input type='text' id='txtFirstNo' name='txtFirstNo' value='' /></td>");
    }

    sb.appendLine("             </tr>");
    sb.appendLine("             <tr>");
    sb.appendLine("                 <td>Enter Second No:</td>");

    if (data && data.txtFirstNo) {
        sb.appendLine("                 <td><input type='text' id='txtSecondNo' name='txtSecondNo' value='{0}' /></td>", data.txtSecondNo);
    }
    else
    {
        sb.appendLine("                 <td><input type='text' id='txtSecondNo' name='txtSecondNo' value='' /></td>");
    }

    sb.appendLine("             </tr>");
    sb.appendLine("             <tr>");
    sb.appendLine("                 <td><input type='submit' value='Calculate'/></td>");
    sb.appendLine("             </tr>");

    if (data && data.txtFirstNo && data.txtSecondNo)
    {
        var sum = parseInt(data.txtFirstNo) + parseInt(data.txtSecondNo);
        sb.appendLine("             <tr>");
        sb.appendLine("                 <td>Sum = {0}</td>", sum);
        sb.appendLine("             </tr>");
    }

    sb.appendLine("         </table>");
    sb.appendLine("     </form>");
    sb.appendLine("</body");
    sb.appendLine("</html>");

    // Sent the StringBuilder sb that we created to the response= resp
    sb.build(function (err, result)
    {
        // The HTML respons document that we sent back to the Client(browser)
        // Write wathever we have on the evaluation of form to result
        // Once StringBuilder have completed all of processing => the entire string will be available on result
        // The same result we will using to sent the response
        resp.write(result);
        //End listening this message = end the response
        resp.end();
    });
}

/// <summary>
/// Function getCalcForm() use 
/// <param req>Request object</param>
/// <param resp>Response object</param>
/// <param formData>Parce the reqBody string</param>
/// </summary>
function getCalcForm(req, resp, formData)
{
    // Ensure that the request is succesfull
    resp.writeHead(200, { "Content-Type": "text/html" });

    getCalcHtml(req, resp, formData);
}

 /// <summary>
 /// Create a server instance
 /// Method that accept the call-back functions witch are executed for each request
 /// function() = requestListener();
 /// <param req>instance of incomming message</param>
 /// <param resp>instance of server response</param>
 /// </summary>
http.createServer(function (req, resp)
{
    // Test which type of request messages we have: GET, POST
    switch (req.method) {
        case "GET":
            // All those url will be simple request for our server
            // If the url is the root url
            if (req.url === "/") {
                // Go to the HomePage
                getHome(req, resp);
            }
            else {
                // If the url is "/calc""
                if (req.url === "/calc")
                {
                    //  Apply getCalcForm() but without data
                    // We are not sending data here because is a fresh request
                    getCalcForm(req, resp);
                }
                else
                {
                    get404(req, resp);
                }
            }
            break;
        case "POST":
            // Ensure that this post works only for the URL that we like and not for someone else
            // I shouds't post nothing on Home page , I sould post only on /calc path
            if (req.url === "/calc")
            {
                // The user will be posting in the pair form (name, value)
                // The request object = req has got 2 events: data and end

                // Declare the variable reqBody
                var reqBody = '';

                // First event call
                // Data event with the handler of data event
                req.on('data', function(data)
                {
                    // Create the request
                    // When I recived a chunk of data into var data add it to the reqBody
                    reqBody += data;
                    
                    // To prevent blowed the server, put a limit of 10MB for the size of request
                    if(reqBody.lenght > 1e7)  // 10 MB
                    {
                        // Return the message "Methode Not Supported" 
                        resp.writeHead(413, 'Request Entity Too Large', { 'Content-Type': 'text/html' });
                        // The HTML respons document that we sent back to the Client(browser)
                        resp.write("<html><head><title>413</title></head><body>413 Request entity too long. Go to <a href='/'>home</a></body></html>");
                        //End listening this message = end the response
                        resp.end();
                    }
                });

                // Second event call
                // End event with the handler of end event
                req.on('end', function(data)
                {
                    // Check to see what you received
                    //console.log(reqBody);

                    // Parce the string reqBody and added to formatData
                    // formData contain s all the informations nedded to calculate the sume and response back to the user 
                    var formData = qs.parse(reqBody);

                    // We calculating the form with req and resp based on the formData
                    getCalcForm(req, resp, formData);
                });
            }
            else
            {
                get404(req, resp);
            }
            break;
        default:
            get405(req,resp);
            break;
    }
}).listen(port);

