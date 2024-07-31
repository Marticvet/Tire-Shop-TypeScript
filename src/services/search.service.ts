// @ts-ignore
import { RestService } from "./rest.service.ts";

export class SearchService extends RestService {
    resourceUrl: string;
    
    constructor() {
        super("searchBy");
    }

    // search model by name
    searchModelByName(manufacturer ,modelName) {
        this.resourceUrl = `searchBy?manufacturer=${manufacturer}&modelName=${modelName}`;

        return this.getAll();
    }
}
