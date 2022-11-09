import { Model, ObjectID } from "@tsed/mongoose";
import { QueryResponseMessageModel } from "./QueryResponseMessageModel";
/**
 * ## How to inject model?
 *
 * ```typescript
 * import { MongooseModel } from "@tsed/mongoose";
 * import { Injectable, Inject } from "@tsed/di";
 *
 * @Injectable()
 * class MyService {
 *   @Inject(messages)
 *   model: MongooseModel<messages>;
 * }
 * ```
 */
@Model({
  name: "messages",
  collection: "messages"
})
export class MessageModel extends QueryResponseMessageModel {
  @ObjectID("id")
  _id: string;

  public toQueryMessageResponseModel(): QueryResponseMessageModel {
    return {
      wfid: this.wfid,
      timestamp: this.timestamp,
      message: this.message
    };
  }
}
