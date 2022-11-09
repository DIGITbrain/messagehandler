import { Controller, Inject } from "@tsed/di";
import { BadRequest } from "@tsed/exceptions";
import { MongooseModel } from "@tsed/mongoose";
import { QueryParams } from "@tsed/platform-params";
import { Get, Returns } from "@tsed/schema";
import { MessageModel } from "src/models/MessageModel";
import { QueryResponseModel } from "src/models/QueryResponseModel";
import { WorkflowModel } from "src/models/WorkflowModel";

const MESSAGE_LIMIT: number = 50;

@Controller("/query")
export class QueryController {

  @Inject(MessageModel) private messageModel: MongooseModel<MessageModel>;
  @Inject(WorkflowModel) private workflowModel: MongooseModel<WorkflowModel>;

  @Get("/")
  @Returns(200, QueryResponseModel).ContentType("application/json")
  @Returns(400, BadRequest).ContentType("json")
  async query(@QueryParams("wfID") wfID: string, @QueryParams("fromTime") fromTime: number, @QueryParams("toTime") toTime: number, @QueryParams("skip") skip: number = 0, @QueryParams("limit") limit: number = MESSAGE_LIMIT) {
    if (!wfID || fromTime == null || toTime == null) {
      throw new BadRequest("Mandatory query parameters are: wfID, fromTime, toTime");
    }
    if (skip < 0) {
      throw new BadRequest("Number of messages to be skipped must not be negative!")
    }
    if (limit <= 0) {
      throw new BadRequest("Limit of number of messages to be returned must be positive!")
    }
    const llimit: number = limit < MESSAGE_LIMIT ? limit : MESSAGE_LIMIT;
    const workflow = await this.workflowModel.find({wfid: wfID});
    if (!workflow) {
      throw new BadRequest("Invalid workflow identifier");
    }
    const filter = {
      wfid: wfID,
      timestamp: {
        $lte: toTime,
        $gte: fromTime
      }
    };
    const messages: MessageModel[] = await this.messageModel.find(filter)
      .sort({timestamp: 1})
      .skip(skip)
      .limit(llimit);
    const total = await this.messageModel.count(filter);
    let rv: QueryResponseModel = {
      count: messages.length,
      total: total,
      results: messages.map((m) => m.toQueryMessageResponseModel())
    };
    return rv;
  }

}
