
import React from 'react';

const Homepage = React.lazy(() => import('../pages/Homepage'));
const Pending = React.lazy(() => import('../pages/Pending'));
const Rejected = React.lazy(() => import('../pages/Rejected'));
const Approved = React.lazy(() => import('../pages/Approved'));
const Request = React.lazy(() => import('../pages/Request'));

const routes = [
    { path: '/home', exact: true, name: 'Homepage', component: Homepage },
    { path: '/pending', exact: true, name: 'Pending', component: Pending },
    { path: '/rejected', exact: true, name: 'Rejected', component: Rejected },
    { path: '/approved', exact: true, name: 'Approved', component: Approved },
    { path: '/request', exact: true, name: 'Requests', component: Request }
];

export default routes;