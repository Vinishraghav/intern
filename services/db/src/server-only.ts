// This file ensures that the database client is only imported on the server side
// and throws a helpful error if imported on the client side

import 'server-only';

export * from './client';
