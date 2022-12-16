// import {Injectable} from "@tsed/di";

// @Injectable()
// export class KeycloakService {

// }

import {Service} from "@tsed/di";
import {MemoryStore} from "express-session";
import {$log} from "@tsed/common";
import {Token} from "keycloak-connect";
import KeycloakConnect = require("keycloak-connect");

@Service()
export class KeycloakService {
  private keycloak: KeycloakConnect.Keycloak;
  private memoryStore: MemoryStore;
  private token: Token;

  constructor() {
    this.initKeycloak();
  }

  public initKeycloak(): KeycloakConnect.Keycloak {
    if (this.keycloak) {
      $log.warn("Trying to init Keycloak again!");
      return this.keycloak;
    } else {
      $log.info("Initializing Keycloak...");
      this.memoryStore = new MemoryStore();
      this.keycloak = new KeycloakConnect({store: this.memoryStore}, "secrets/keycloak.json");
      return this.keycloak;
    }
  }

  public getKeycloakInstance(): KeycloakConnect.Keycloak {
    return this.keycloak;
  }

  public getMemoryStore(): MemoryStore {
    return this.memoryStore;
  }

  public getToken(): Token {
    return this.token;
  }

  public setToken(token: Token): void {
    this.token = token;
  }
}