import { Request as ExpressReq, RequestHandler, Response as ExpressRes } from 'express';
import Controller, { Request, Response } from '../../../shared/http/controller';

function route<T>(controller: Controller<T>): RequestHandler {
  return async (request: ExpressReq, response: ExpressRes): Promise<void> => {
    const req: Request<T> = {
      payload: request.body,
    };

    const res: Response<any> = await controller.handle(req);
    if (res?.payload) {
      response.status(res.statusCode).send(res.payload);
      return;
    }

    response.sendStatus(res.statusCode);
  };
}

export default route;
