import express from "express";
import compression from "compression";
import session from "express-session";
const app = express();
app.locals.basedir = '.';
app.use(compression());
app.use(express.json());
app.use(express.static('dist'));
app.use(session({
    secret: 'charitychain',
    resave: false,
    saveUninitialized: true
}));
const port = normalizePort(process.env.PORT || '3000');
import indexRouter from "./src/routers/IndexRouter";
import apiRouter from "./src/routers/ApiRouter";
import fakeApiRouter from "./src/routers/FakeApiRouter";

app.use('/', indexRouter);
app.use('/api', apiRouter);
app.use('/fakeapi', fakeApiRouter);


app.listen(port, () => console.log(`App listening at http://localhost:${port}`))


/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val: string) {
    var port = parseInt(val, 10);

    if (isNaN(port)) {
        // named pipe
        return val;
    }

    if (port >= 0) {
        // port number
        return port;
    }

    return false;
}