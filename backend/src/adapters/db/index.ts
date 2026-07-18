// This barrel file exists to keep the database adapter surface simple.
// It makes imports cleaner for the server bootstrap and future modules.
// Future feature modules can import from this index without knowing the internal file layout.

export * from './connection.js';
export * from './health.js';
export * from './startup.js';
