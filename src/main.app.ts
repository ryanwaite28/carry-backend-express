
import * as dotenv from 'dotenv';
import { exec } from 'child_process';
// import {  } from 'os';
dotenv.config();
console.log(`process.env:`, process.env);
console.log(`__dirname`, __dirname);
console.log(`cwd`, process.cwd());

exec('ls -atRl ./build', (err, stdout, stderr) => {
  if (err) {
    // node couldn't execute the command
    console.log(`ls -atRl ./build error:`, err);
    return;
  }

  // the *entire* stdout and stderr (buffered)
  console.log(`ls -atRl ./build`);
  console.log(`stdout: ${stdout}`);
  console.log(`stderr: ${stderr}`);
});


exec('ls -atl', (err, stdout, stderr) => {
  if (err) {
    // node couldn't execute the command
    console.log(`ls -atl error:`, err);
    return;
  }

  // the *entire* stdout and stderr (buffered)
  console.log(`ls -atl ./`);
  console.log(`stdout: ${stdout}`);
  console.log(`stderr: ${stderr}`);
});



import express, { Request, Response } from 'express';
import * as path from 'path';
import { Server } from "socket.io";
import * as http from 'http';

import { SocketsService } from './services/sockets.service';
import { isProd } from './utils/constants.utils';
import { uniqueValue } from './utils/helpers.utils';
import { StripeService } from './services/stripe.service';
import { StripeWebhookEventsRequestHandler } from './services/stripe-webhook-events.service';
import { CarryRouter } from './routers/_carry.router';
import { carry_db_init } from './models/_def.model';
import { installExpressApp } from './utils/template-engine.utils';
import { RequestLoggerMiddleware } from './middlewares/request-logger.middleware';
import { AppEnvironment } from './utils/app.enviornment';




/** Setup */

const PORT: string | number = process.env.PORT || 80;
const app: express.Application = express();

installExpressApp(app);


app.set('trust proxy', true);

app.use(RequestLoggerMiddleware);

const appServer: http.Server = http.createServer(app);


// const peerServer = ExpressPeerServer(appServer, {
//   // debug: true,
//   path: '/modern-peer'
// });
// app.use('/peerjs', peerServer);



const io: Server = new Server(appServer, {
  cors: {
    origin: AppEnvironment.CORS.WHITELIST,
  },

  allowRequest: (req, callback) => {
    console.log(`socket req origin: ${req.headers.origin}`);
    const useOrigin = (req.headers.origin || '');
    const originIsAllowed = !isProd || AppEnvironment.CORS.WHITELIST.includes(useOrigin);
    console.log({ originIsAllowed });
    callback(null, originIsAllowed);
  }
});
io.engine.generateId = (req: any) => {
  return uniqueValue(); // must be unique across all Socket.IO servers
};

SocketsService.handle_io_connections(io);




/** Mount Sub-Router(s) to Master Application Instance */
const endpointSecret = process.env.STRIPE_WEBHOOK_SIG ;
app.post('/stripe-webhook', express.raw({ type: 'application/json' }), async (request: Request, response: Response) => {  
  const sig = request.headers['stripe-signature'];
  console.log(`-------stripe webhook request:-------`, { body: request.body, headers: request.headers, sig, STRIPE_WEBHOOK_SIG: process.env.STRIPE_WEBHOOK_SIG });

  let event;

  try {
    event = StripeService.stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
  } catch (err) {
    const msg = `Webhook Error: ${err['message']}`;
    console.log(msg);
    response.status(400).send(msg);
    return;
  }
  
  console.log(`stripe webhook event:`, { event }, JSON.stringify(event));
  
  return StripeWebhookEventsRequestHandler.handleEvent(event, request, response);
});


app.use('/', CarryRouter);



/** Static file declaration */
const assetsPath = path.join(__dirname, '../', 'assets');
console.log({ assetsPath });
app.use(express.static(assetsPath));

/** init database */
console.log(`PORT = ${PORT}\n`);
console.log(`Connecting to database...\n`);
try {
  carry_db_init().then(() => {
    console.log(`app db ready; starting app.`);
  
    /** Start Server */
    appServer.listen(PORT);
    console.log(`Listening on port ${PORT}...\n\n`);
  });  
} catch (error) {
  console.log(`db_init error...`, { error });
  throw error;
}
