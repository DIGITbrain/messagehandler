import {Controller, Inject} from "@tsed/di";
import { InternalServerError } from "@tsed/exceptions";
import { MongooseModel } from "@tsed/mongoose";
import {Get, Returns} from "@tsed/schema";
import { HealthResponseModel } from "src/models/HealthResponseModel";
import { WorkflowModel } from "src/models/WorkflowModel";

@Controller("/health")
export class HealthController {

  @Inject(WorkflowModel) private workflowModel: MongooseModel<WorkflowModel>;

  @Get("/")
  @Returns(200, HealthResponseModel).ContentType("application/json")
  @Returns(500, InternalServerError).ContentType("application/json")
  async health() {
    try {
      const workflow = await this.workflowModel.find({});
      return {
        status: 'ok'
      };
    } catch (e) {
      throw new InternalServerError(e);
    }
  }
}
