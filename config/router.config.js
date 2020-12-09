export default [
  // user
  {
    path: '/user',
    component: '../layouts/UserLayout',
    routes: [
      { path: '/user', redirect: '/user/login' },
      { path: '/user/login', component: './User/Login' },
      { path: '/user/register', component: './User/Register' },
      { path: '/user/register-result', component: './User/RegisterResult' },
    ],
  },
  // app
  {
    path: '/',
    component: '../layouts/BasicLayout',
    Routes: ['src/pages/Authorized'],
    routes: [
      {
        path: '/ncov/goods',
        // name: 'templates',
        hideChildrenInMenu: true,
        routes: [
          { path: '/ncov/goods', redirect: '/ncov/goods/list' },
          {
            path: '/ncov/goods/list',
            component: './Goodss/List',
          },
          {
            path: '/ncov/goods/create',
            component: './Goodss/Form',
          },
          {
            path: '/ncov/goods/update/:id',
            component: './Goodss/Form',
          }
        ],
      },
      {
        path: '/ncov/environments',
        // name: 'templates',
        hideChildrenInMenu: true,
        routes: [
          { path: '/ncov/environments', redirect: '/ncov/environments/list' },
          {
            path: '/ncov/environments/list',
            component: './Environments/List',
          },
          {
            path: '/ncov/environments/create',
            component: './Environments/Form',
          },
          {
            path: '/ncov/environments/update/:id',
            component: './Environments/Form',
          }
        ],
      },
      {
        path: '/ncov/companies',
        // name: 'templates',
        hideChildrenInMenu: true,
        routes: [
          { path: '/ncov/companies', redirect: '/ncov/companies/list' },
          {
            path: '/ncov/companies/list',
            component: './Companys/List',
          },
          {
            path: '/ncov/companies/create',
            component: './Companys/Form',
          },
          {
            path: '/ncov/companies/update/:id',
            component: './Companys/Form',
          }
        ],
      },
      {
        path: '/ncov/users',
        // name: 'templates',
        hideChildrenInMenu: true,
        routes: [
          { path: '/ncov/users', redirect: '/ncov/users/list' },
          {
            path: '/ncov/users/list',
            component: './Userss/List',
          },
          {
            path: '/ncov/users/create',
            component: './Userss/Form',
          },
          {
            path: '/ncov/users/update/:id',
            component: './Userss/Form',
          }
        ],
      },
      // {
      //   path: '/ncov/users',
      //   // name: 'templates',
      //   hideChildrenInMenu: true,
      //   routes: [
      //     { path: '/ncov/users', redirect: '/ncov/users/list' },
      //     {
      //       path: '/ncov/users/list',
      //       component: './Userss/List',
      //     },
      //     {
      //       path: '/ncov/users/create',
      //       component: './Userss/Form',
      //     },
      //     {
      //       path: '/ncov/users/update/:id',
      //       component: './Userss/Form',
      //     }
      //   ],
      // },
      {
        component: '404',
      },
    ],
  },
];
