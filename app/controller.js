import { ResponseBuilder } from "./response.js";
import { Response } from "./response.js";
import { Request } from "./request.js";

class Controller {

    /**
     *  Serve requests
     *  @param {Request} request - The request
     *  @returns {Response} - The response
     */
    serve(request) {
        const requestLine = request.requestLine;
        console.log(`serve ${requestLine}`);
        if (requestLine.path === "/") {
            if (requestLine.httpMethod === "GET"){
                const response = new ResponseBuilder()
                      .status(200, 'OK')
                      .build();
                return response;
            }
        }
        if (requestLine.path === "/user-agent") {
            if (requestLine.httpMethod === "GET"){
                const userAgent = request.header['User-Agent'];
                const response = !userAgent ?
                      new ResponseBuilder()
                      .status(400, 'Bad Request')
                      .build()
                      : new ResponseBuilder()
                      .status(200, 'OK')
                      .body(userAgent)
                      .build();
                return response;
            }
        }
        if (requestLine.path.startsWith('/echo/')) {
            const pathArg = requestLine.path.substring('/echo/'.length)
            if (requestLine.httpMethod === "GET"){
                const response = new ResponseBuilder()
                      .status(200, 'OK')
                      .body(pathArg)
                      .build();
                return response;
            }
        }
        return new ResponseBuilder()
            .status(404, 'Not Found')
            .build();
    }
}

export { Controller };
