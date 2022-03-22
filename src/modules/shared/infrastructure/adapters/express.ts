import { RequestHandler, Request, Response } from 'express';

import Controller, { Request as ControllerRequest, Response as ControllerResponse } from '../../http/controller';

export default class ExpressAdapter {
  public static route<T>(controller: Controller<T>): RequestHandler {
    return async (request: Request, response: Response): Promise<void> => {
      const req: ControllerRequest<T> = {
        payload: request.body,
      };

      const res: ControllerResponse<any> = await controller.handle(req);
      if (res.payload) {
        response.status(res.statusCode).send(res.payload);
        return;
      }

      response.sendStatus(res.statusCode);
    };
  }
}
