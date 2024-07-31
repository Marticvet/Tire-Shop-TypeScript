// @ts-ignore
import { RestService } from "./rest.service.ts";

export class ManufacturerService extends RestService {
    resourceUrl: string;

    constructor() {
        super("tires/manufacturers");
    }

    // get all tires manufacturers
    getAllManufacturers() {
        this.resourceUrl = "tires/manufacturers";

        return this.getAll();
    }

    // get manufacturer by name
    getManufacturerByName(manufacturerName) {
        this.resourceUrl =
            "tires/manufacturers/" + manufacturerName;

        return this.getAll();
    }

    // get all models by manufacturer
    getModelsByManufacturerByName(manufacturerName) {
        this.resourceUrl =
            "tires/manufacturers/" + manufacturerName + "/tire-models";

        return this.getAll();
    }

    // get manufacturer model by tireId and all available sizes
    getManufacturerModelById(manufacturerName, tireId) {
        this.resourceUrl =
            "tires/manufacturers/" + manufacturerName + "/tire-model/" + tireId;

        return this.getAll();
    }
}
