import { Controller, Inject } from "@tsed/di";
import { BadRequest, Unauthorized } from "@tsed/exceptions";
import { MongooseModel } from "@tsed/mongoose";
import { BodyParams, PathParams } from "@tsed/platform-params";
import { Post, Returns } from "@tsed/schema";
import { MessageModel } from "src/models/MessageModel";
import { SuccessResponseModel } from "src/models/SuccessResponseModel";
import { WorkflowModel } from "src/models/WorkflowModel";

@Controller("/sendmessage")
export class SendMessageController {

  @Inject(WorkflowModel) private workflowModel: MongooseModel<WorkflowModel>;
  @Inject(MessageModel) private messageModel: MongooseModel<MessageModel>;

  @Post("/:wfID")
  @Returns(200, SuccessResponseModel).ContentType("application/json")
  @Returns(400, BadRequest).ContentType("json")
  @Returns(401, Unauthorized).ContentType("json")
  async sendmessage(@PathParams("wfID") wfID: string, @BodyParams("wfNonce") wfNonce: string, @BodyParams("timestamp") timestamp: number, @BodyParams("message") message: any) {
    if (!wfID || !wfNonce || !message) {
      throw new BadRequest("Invalid request parameters");
    }
    const wfentry = await this.workflowModel.findOne({wfid: wfID});
    if (!wfentry) {
      throw new BadRequest("Invalid workflow provided");
    }
    if (wfentry.nonce !== wfNonce) {
      throw new Unauthorized("The provided credentials cannot be used to identify the workflow");
    }
    const newmessage = new this.messageModel({
      wfid: wfID,
      timestamp: timestamp,
      message: message
    });
    await newmessage.save();
    return {
      "message": "message successfully stored"
    };
  }
}
