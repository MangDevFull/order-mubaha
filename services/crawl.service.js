import request from 'request';
import httpMsgs from "http-msgs";

const crawl = async (req, res, next) => {
    const data = req.body.url
    console.log(data);
    request.post({ url: "http://127.0.0.1:5000/api/v1/resources/price", form: { url: data } }, function (err, httpResponse, body) {
        console.log('error:', err); // Print the error if one occurred
        console.log('statusCode:', httpResponse && httpResponse.statusCode); // Print the response status code if a response was received
        console.log('body:', body); // Print the HTML for the Google homepage.
        if(httpResponse.statusCode == 500) {
            console.log("Lỗi sml")
            return httpMsgs.sendJSON(req, res, { 'status':500 });
        }else{
            return httpMsgs.sendJSON(req, res, { 'rs': body,'status':200 });
        }
    })
}
export {
    crawl
}

