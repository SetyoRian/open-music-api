const routes = (handler) => [
  {
    method: 'POST',
    path: '/users',
    handler: (request, h) => handler.postUser(request, h),
  },
];

module.exports = routes;
