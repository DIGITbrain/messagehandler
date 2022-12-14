import {join} from "path";
import {Configuration, Inject} from "@tsed/di";
import {PlatformApplication} from "@tsed/common";
import "@tsed/platform-express"; // /!\ keep this import
import bodyParser from "body-parser";
import compress from "compression";
import cookieParser from "cookie-parser";
import methodOverride from "method-override";
import cors from "cors";
import "@tsed/ajv";
import "@tsed/swagger";
import "@tsed/mongoose";
import {config} from "./config";
import * as rest from "./controllers/rest";
import * as pages from "./controllers/pages";
import { KeycloakService } from "./services/KeycloakService";
import session from "express-session";

@Configuration({
  ...config,
  acceptMimes: ["application/json"],
  httpPort: process.env.PORT || 8083,
  httpsPort: false, // CHANGE
  componentsScan: false,
  mount: {
    "/v1/emgmh/rest": [
      ...Object.values(rest)
    ],
    "/": [
      ...Object.values(pages)
    ]
  },
  swagger: [
    {
      path: "/v1/emgmh/doc",
      specVersion: "3.0.1"
    }
  ],
  middlewares: [
    cors(),
    cookieParser(),
    compress({}),
    methodOverride(),
    bodyParser.json(),
    bodyParser.urlencoded({
      extended: true
    })  ],
  views: {
    root: join(process.cwd(), "../views"),
    extensions: {
      ejs: "ejs"
    }
  },
  exclude: [
    "**/*.spec.ts"
  ]
})
export class Server {
  @Inject()
  protected app: PlatformApplication;

  @Inject()
  protected keycloakService: KeycloakService;

  @Configuration()
  protected settings: Configuration;

  $beforeRoutesInit(): void {
    this.app.use(
      session({
        secret: "thisShouldBeLongAndSecret",
        resave: false,
        saveUninitialized: true,
        store: this.keycloakService.getMemoryStore()
      })
    );
    this.app.use(this.keycloakService.getKeycloakInstance().middleware());
  }
}
