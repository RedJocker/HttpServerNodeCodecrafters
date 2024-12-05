import { ResponseBuilder } from "./response.js";
import { Response } from "./response.js";
import { Request } from "./request.js";
import { FileService } from "./fileService.js";

class Controller {

    /**
     * Class that will handle requests and produce responses,
     * the actual response production might be delegated to some
     * specialized service
     * @param {FileService} fileService - The instance that will deal with files
     */
    constructor(fileService) {
	this.fileService = fileService
    }

    /**
     *  Serve requests
     *  @param {Request} request - The request
     *  @returns {Response} - The response
     */
    async serve(request) {
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
                      .bodyTextPlain(userAgent)
                      .build();
                return response;
            }
        }
        if (requestLine.path.startsWith('/echo/')) {
            const pathArg = requestLine.path.substring('/echo/'.length)
            if (requestLine.httpMethod === "GET"){
                const response = new ResponseBuilder()
                      .status(200, 'OK')
                      .bodyTextPlain(pathArg)
                      .build();
                return response;
            }
        }
	if (requestLine.path.startsWith('/files/')) {
            const pathArg = requestLine.path.substring('/files/'.length)
            if (requestLine.httpMethod === "GET"){
		const fileBuffer = await this.fileService.fileAsBuffer(pathArg)
		if (fileBuffer) {
		    const response = new ResponseBuilder()
                      .status(200, 'OK')
                      .bodyOctetStream(fileBuffer)
                      .build();
                    return response;
		}
            }
        }

        return new ResponseBuilder()
            .status(404, 'Not Found')
            .build();
    }
}

export { Controller };
