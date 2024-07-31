// @ts-ignore
import { RestService } from "./rest.service.ts";

export class SizesService extends RestService {
    resourceUrl: string;

    constructor() {
        super("sizes");
    }

    // get models with specific sizes and criterias
    async getModelSizes(width: number, height: number, diameter: number, season: string, manufacturer: string) {
        this.resourceUrl = `sizes?width=${width}&height=${height}&diameter=${diameter}&season=${season}&manufacturer=${manufacturer}`;
        
        return await this.getAll();
    }

    // get all sizes by modelId
    async getSizesByModelId(modelId) {
        this.resourceUrl = "sizes/model-sizes/" + modelId;

        return await this.getAll();
    }
}
