/**
 * Main application routes
 */

import errors from './components/errors';
import path from 'path';
import express from 'express';

export default function(app) {
    // Insert routes below
    app.use('/api/production_dept', require('./api/production_dept'));
    app.use('/api/quarantine_dept', require('./api/quarantine_dept'));
    app.use('/api/doc_team', require('./api/documentation_dept'));
    app.use('/api/stock', require('./api/stock'));
    app.use('/api/order', require('./api/order'));
    app.use('/api/users', require('./api/user'));
    app.use('/auth', require('./auth').default);
    app.use('/apidoc', express.static('apidoc'));
    // All undefined asset or api routes should return a 404
    app.route('/:url(api|auth|components|app|bower_components|assets)/*')
        .get(errors[404]);

    // All other routes should redirect to the app.html
    app.route('/*')
        .get((req, res) => {
            res.sendFile(path.resolve(`${app.get('appPath')}/app.html`));
        });
}
