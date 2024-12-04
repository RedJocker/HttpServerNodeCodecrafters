import { ResponseBuilder } from "./response.js";
import { Response } from "./response.js";

class Controller {

    /**
     *  Serve requests
     *  @param {RequestLine} requestLine - The request
     *  @returns {Response} - The response
     */
    serve(requestLine) {
        console.log(`serve ${requestLine}`);
        if (requestLine.path === "/") {
            if (requestLine.httpMethod === "GET"){
                const response = new ResponseBuilder()
                      .status(200, 'OK')
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
import { RequestLine } from "./request.js";

export { Controller };
