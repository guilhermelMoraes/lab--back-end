import Controller, { Request, Response } from '@shared/http/controller';
import { Request as ExpressReq, RequestHandler, Response as ExpressRes } from 'express';

function expressRouteAdapter<T>(controller: Controller<T>): RequestHandler {
  return async (request: ExpressReq, response: ExpressRes): Promise<void> => {
    const req: Request<T> = {
      payload: request.body,
      queryParams: request.query,
    };

    const res: Response<unknown> = await controller.handle(req);
    if (res?.payload) {
      response.status(res.statusCode).send(res.payload);
      return;
    }

    response.sendStatus(res.statusCode);
  };
}

export default expressRouteAdapter;
