import { CollectionOf, Integer, Property } from "@tsed/schema";
import { QueryResponseMessageModel } from "./QueryResponseMessageModel";

export class QueryResponseModel {

  @Property()
  @Integer()
  count: number;

  @Property()
  @Integer()
  total: number;

  @Property()
  @CollectionOf(QueryResponseMessageModel)
  results: QueryResponseMessageModel[];

}
