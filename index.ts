

import express,  { type Request, type Response } from "express";
import http from "http";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import WebSocket from "ws";
import { AppDataSource } from "./TypeORM/TypeORM";
import { AppConfig, ValidateDataAppConfig } from "./config/app.config";
import RouterApp from "./Router/Router";

import "dotenv/config.js";
import { Robot } from "./entity/Robot";

const app = express();

// CORS
app.use(
  "*",
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

const ropotRepo = AppDataSource.getRepository(Robot)

// JSON & Form Parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// HTTP Logging & Security
app.use(morgan("dev"));
app.use(helmet.hidePoweredBy());
app.use(helmet.ieNoOpen());
app.use(helmet.hsts());

// Routes
// app.use("/", (req: Request, res: Response) => {
//   console.log("HTTP from ESP32");
//   res.send("ESP32 Connected");
// });
app.use("/api/", RouterApp);

// Create HTTP Server
const server = http.createServer(app);

//  Create WebSocket Server with `ws` and attach it to HTTP server
const wss = new WebSocket.Server({ server });

wss.on("connection", (ws: WebSocket) => {
  console.log("WebSocket Robot connected");


  ws.on("message", async (data: WebSocket.Data) => {
    const str = data.toString();
    let message;

    try {
      message = JSON.parse(str);
    } catch (e) {
      console.error("❌ Invalid JSON from robot:", str);
      return;
    }

    console.log("✅ Received from robot:", message);

    const check = await ropotRepo.findOne({ where: { id: message.robot_id } });

    if (check) {
      await ropotRepo.update(
        { id: message.robot_id },
        {
          stausWork: message.stausWork,
          statusSante: message.statusSante,
          finich: message.finich,
          start: message.start,
        }
      );
    } else {
      await ropotRepo.create({
        name: `robot ${message.macAdr}`,
        location: [message.x, message.y],
        stausWork: message.stausWork,
        statusSante: message.statusSante,
        finich: message.finich,
        start: message.start,
      });
    }

    // 🔁 Send data to all connected clients (frontend)
    wss.clients.forEach((client: any) => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(`getDataFromRobot: ${JSON.stringify(message)}`);
      }
    });
  });


  // ws.on("message", async (data: WebSocket.Data) => {
  //   const message:any = data.toString();
  //   const check = await ropotRepo.findOne({where : {id : message.id}})
  //   if(check){
  //     await ropotRepo.update(
  //       { id: message.id },
  //       {
  //         stausWork: message.stausWork,
  //         statusSante: message.statusSante,
  //         finich: message.finich,
  //         start: message.start,
  //       }
  //     );
  //       wss.clients.forEach((client: any) => {
  //         if (client !== ws && client.readyState === WebSocket.OPEN) {
  //           client.send(`getDataFromRobot: ${message}`);
  //         }
  //       });
  //   }
  //   else{
  //     await ropotRepo.create({
  //       name: ` robot ${message.macAdr}`,
  //       location: [message.loca.x, message.loca.y],
  //       stausWork: message.stausWork,
  //       statusSante: message.statusSante,
  //       finich: message.finich,
  //       start : message.start
  //     });
  //     wss.clients.forEach((client:any) => {
  //       if (client !== ws && client.readyState === WebSocket.OPEN) {
  //         client.send(`getDataFromRobot: ${message}`);
  //       }
  //     });
  //   }
  //   console.log(" Received from robot:", message); 

  //   // You can emit it to frontends or save it here
  //   // wss.clients.forEach((client) => {
  //   //   if (client !== ws && client.readyState === WebSocket.OPEN) {
  //   //     client.send(`getDataFromRobot: ${message}`);
  //   //   }
  //   // });
  // });
});







ValidateDataAppConfig(() => {
  AppDataSource.initialize()
    .then(() => {
      console.log(" SQL connection... done");
      server.listen(AppConfig.PORT, () => {
        console.log(" Server running on port:", AppConfig.PORT);
      });
    })
    .catch((err) => {
      console.error(" Error during SQL init:", err);
    });
});





// import helmet  from "helmet";
// import morgan from "morgan"
// import express from 'express'
// import { AppDataSource } from "./TypeORM/TypeORM";
// import "dotenv/config.js"
// import { AppConfig, ValidateDataAppConfig } from "./config/app.config";
// import cors from 'cors'
// import http from 'http'
// import RouterApp from "./Router/Router";
// // import { funSocket } from "./socket";

// import type { Request, Response } from "express";


// const app = express()
// app.use('*',
//   cors({
//     origin: "http://localhost:3000",
//     credentials: true,
//   })
// );


// app.use('/' , (req:Request , res:Response)=>{
//    console.log('HTTP ESP2S3')
//    return
// })

// const httpServer:any = http.createServer(app)

// app.use(express.json());
// app.use(express.urlencoded({extended:true}))
// app.use('/api/', RouterApp)
// app.use(morgan('dev'))
// app.use(helmet.hidePoweredBy())
// app.use(helmet.ieNoOpen())
// app.use(helmet.hsts())



// const server = http.createServer(app);

// // Create WebSocket server and attach to HTTP server
// const wss = new WebSocket.Server({ server });

// wss.on("connection", (ws: WebSocket) => {
//   console.log("🚀 WebSocket client connected");

//   ws.on("message", (data: WebSocket.Data) => {
//     console.log("📡 Received from client:", data.toString());

//     // Example: broadcast to all other clients
//     wss.clients.forEach((client) => {
//       if (client !== ws && client.readyState === WebSocket.OPEN) {
//         client.send(`getDataFromRobot: ${data}`);
//       }
//     });
//   });

//   ws.on("close", () => {
//     console.log("❌ WebSocket client disconnected");
//   });

//   ws.send("✅ Welcome to the WebSocket server!");
// });



// console.log('starting App...');

// ValidateDataAppConfig(()=>{ 
//      AppDataSource.initialize()
//      .then(()=>{
//       console.log("seconde");
//          console.log('SQL cnx....done');
//          httpServer.listen(AppConfig.PORT, () => {
//            console.log("srv cnx....in Port : ", AppConfig.PORT);
//          });         
//      }).catch((err)=>{
//         console.log('Err from config :' , err);
//      })
// })







