import { Request, Response } from 'express';
import Mock from 'mockjs';

import config from '../src/config';

let { domain } = config;

let isMock = true;
// isMock = false;
if (process.env.NODE_ENV === 'production') isMock = false;

let wait = (time = 500) => new Promise((resolve) => setTimeout(resolve, time));

/*  */
/*  */
/*  */
/** */
let TEMP = async (req: Request, res: Response) => {
  res.send({
    code: 0,
    msg: 'mock',
    data: {},
  });
};

export default isMock
  ? {
      /*  */
      ['POST ' + domain + 'TEMP']: Mock.mock(TEMP),
    }
  : {};
