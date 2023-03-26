import { Request, Response } from 'express';
// import Mock from 'mockjs';

let useMock;
useMock = true;
useMock = false;

let apis = [
  {
    url: '/api/temp',
    method: 'POST',
    data: {},
  },
  {
    url: '/api/temp',
    branch: 'method',
    branchs: {
      temp: {},
    },
  },
];

let mocks = apis.reduce((p, i) => {
  let { url, method, data, branch, branchs } = i;

  /* 是否为简单模拟 */
  if (data) {
    let key = method ? `${i.method} ${url}` : url;
    return {
      ...p,
      [key]: {
        errcode: 0,
        msg: 'mock',
        data,
      },
    };
  } else {
    let fun = (req: Request, res: Response) => {
      if (!branch) return;
      if (!branchs) return;

      let param: keyof typeof branchs;
      switch (req.method) {
        case 'POST': {
          param = req.body[branch];
          break;
        }

        default: {
          param = req.query[branch];
          break;
        }
      }

      res.send({
        errcode: 0,
        msg: 'mock',
        data: branchs[param] || {},
      });
    };

    return {
      ...p,
      [`GET ${url}`]: fun,
      [`POST ${url}`]: fun,
    };
  }
}, {});

export default useMock ? mocks : {};
