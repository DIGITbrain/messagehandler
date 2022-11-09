import { Controller, Inject } from "@tsed/di";
import { BadRequest } from "@tsed/exceptions";
import { MongooseModel } from "@tsed/mongoose";
import { BodyParams } from "@tsed/platform-params";
import { Post, Returns} from "@tsed/schema";
import { SuccessResponseModel } from "src/models/SuccessResponseModel";
import { WorkflowModel } from "src/models/WorkflowModel";

@Controller("/registerworkflow")
export class RegisterWorkflowController {

  @Inject(WorkflowModel) private workflowModel: MongooseModel<WorkflowModel>;

  @Post("/")
  @Returns(200, SuccessResponseModel).ContentType("application/json")
  @Returns(400, BadRequest).ContentType("json")
  async registerWorkflow(@BodyParams("dmaID") dmaid: string, @BodyParams("wfID") wfID: string, @BodyParams("wfNonce") wfNonce: string) {
    if (!dmaid || !wfID || !wfNonce) {
      throw new BadRequest("Invalid or missing request parameters");
    }
    const exists = await this.workflowModel.findOne({wfid: wfID});
    if (exists) {
      throw new BadRequest("The provided workflow identifier is invalid!");
    }
    const newEntry = new this.workflowModel({
      dmaid: dmaid,
      wfid: wfID,
      nonce: wfNonce
    });
    await newEntry.save();
    return {
      "message": "Workflow registered successfully."
    };
  }
}
