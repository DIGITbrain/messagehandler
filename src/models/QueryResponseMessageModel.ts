import { Indexed } from "@tsed/mongoose";
import {Integer, Property} from "@tsed/schema";

export class QueryResponseMessageModel {
  @Property()
  @Indexed()
  wfid: string;

  @Property()
  @Integer()
  timestamp: number;

  @Property()
  message: any;
}
