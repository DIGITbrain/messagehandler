import { Indexed, Model, ObjectID, Unique } from "@tsed/mongoose";
import { Property } from "@tsed/schema";
/**
 * ## How to inject model?
 *
 * ```typescript
 * import { MongooseModel } from "@tsed/mongoose";
 * import { Injectable, Inject } from "@tsed/di";
 *
 * @Injectable()
 * class MyService {
 *   @Inject(workflows)
 *   model: MongooseModel<workflows>;
 * }
 * ```
 */
@Model({
  name: "workflows",
  collection: "workflows"
})
export class WorkflowModel {
  @ObjectID("id")
  _id: string;

  @Property()
  dmaid: string;

  @Property()
  @Unique()
  @Indexed()
  wfid: string;

  @Property()
  nonce: string;
}
