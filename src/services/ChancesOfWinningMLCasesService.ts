import ArrayHelper from "@app/helpers/ArrayHelper";
import { UtilsHelper } from "@app/helpers/UtilsHelper";

export class ChancesOfWinningMLCasesService {

    private mlCases: any;

    constructor() {
        this.mlCases = {};
        this.mlCases['Contributory negligence by consumer'] = 5;
        this.mlCases['Contributory negligence by company'] = 85; // verified
        this.mlCases['deficiency in service by manufacturer'] = 92;
        this.mlCases['deficiency in service by  Ecomm./ offline retailer'] = 84;  // verified
    }

    public getHigherChances = (mlCases: string): any => {
        let higherChances = 0;
        if (mlCases) {
            let mlCasesArray = mlCases.split(",");
            mlCasesArray.forEach(mlCase => {
                if (mlCase in this.mlCases) {
                    if (this.mlCases[mlCase] > higherChances) {
                        higherChances = this.mlCases[mlCase];
                    }
                }
            });
        } else {
            higherChances = UtilsHelper.generateRandomNumberBetweenRange(56, 60);
        }
        return { winning_chances_val: higherChances };
    }
}
export const chancesOfWinningMLCasesServiceIns = new ChancesOfWinningMLCasesService();