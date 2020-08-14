"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.chancesOfWinningMLCasesServiceIns = exports.ChancesOfWinningMLCasesService = void 0;
const UtilsHelper_1 = require("@app/helpers/UtilsHelper");
class ChancesOfWinningMLCasesService {
    constructor() {
        this.getHigherChances = (mlCases) => {
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
            }
            else {
                higherChances = UtilsHelper_1.UtilsHelper.generateRandomNumberBetweenRange(56, 60);
            }
            return { winning_chances_val: higherChances };
        };
        this.mlCases = {};
        this.mlCases['Contributory negligence by consumer'] = 5;
        this.mlCases['Contributory negligence by company'] = 85; // verified
        this.mlCases['deficiency in service by manufacturer'] = 92;
        this.mlCases['deficiency in service by  Ecomm./ offline retailer'] = 84; // verified
    }
}
exports.ChancesOfWinningMLCasesService = ChancesOfWinningMLCasesService;
exports.chancesOfWinningMLCasesServiceIns = new ChancesOfWinningMLCasesService();
//# sourceMappingURL=ChancesOfWinningMLCasesService.js.map