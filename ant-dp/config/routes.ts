let isDev = process.env.NODE_ENV === 'development';

export default [
  /* 用户 */
  {
    path: '/user',
    layout: false,
    routes: [
      {
        name: 'login',
        path: '/user/login',
        component: './user/Login',
        layout: false,
      },
      {
        path: '/user',
        redirect: '/user/login',
      },
      {
        name: 'register-result',
        path: '/user/register-result',
        component: './user/register-result',
        icon: 'smile',
      },
      {
        name: 'register',
        path: '/user/register',
        component: './user/register',
        icon: 'smile',
      },
      {
        component: '404',
      },
    ],
  },

  /* 测试 */
  {
    name: '开发测试',
    path: '/test',
    icon: 'bug',
    hideInMenu: !isDev,
    routes: [
      {
        path: './',
        component: './Test',
      },
    ],
  },

  {
    name: '欢迎',
    path: '/welcome',
    component: './Welcome',
    icon: 'smile',
    hideInMenu: true,
  },
  {
    path: '/',
    redirect: '/welcome',
  },

  {
    component: '404',
  },
];
