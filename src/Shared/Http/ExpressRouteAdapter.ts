import { TypeGuards } from '@shared/Utils';
import {
  Request as ExpressReq, RequestHandler, Response as ExpressRes,
} from 'express';
import Controller, { Request, Response } from './Controller';

function expressRouteAdapter<T>(controller: Controller<T>): RequestHandler {
  return async (req: ExpressReq, res: ExpressRes): Promise<unknown> => {
    const request: Request<T> = {
      payload: req.body,
      queryParams: req.query,
    };

    const response: Response<unknown> = await controller.handle(request);

    if (TypeGuards.isNotUndefined(response.payload)) {
      res.status(response.statusCode).send(response.payload);
      return;
    }

    res.sendStatus(response.statusCode);
  };
}

export default expressRouteAdapter;
