"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ddf_query_validator_1 = require("ddf-query-validator");
const common_1 = require("../../test/common");
const path = require("path");
const ALL_CONCEPTS = ['', ' ', ddf_query_validator_1.RESERVED_CONCEPT, ddf_query_validator_1.RESERVED_CONCEPT_TYPE, ddf_query_validator_1.RESERVED_DOMAIN, ddf_query_validator_1.RESERVED_DRILL_UP, 'company', 'english_speaking', 'company_scale', 'name', 'anno', 'lines_of_code', 'region', 'country', 'latitude', 'longitude', 'full_name_changed', 'project', 'additional_column', 'meeting_style', 'popular_appeal', 'methodology'];
exports.description = 'Autogenerated tests for concepts';
exports.initData = { path: path.join(common_1.BASE_PATH, common_1.WS_TESTING_PATH, 'master-HEAD') };
exports.testsDescriptors = {
    [exports.description]: ALL_CONCEPTS.map((concept) => ({
        itTitle: `should be fine for concept '${concept}'`,
        query: {
            from: 'concepts',
            dataset: common_1.WS_TESTING_PATH,
            select: { key: ['concept'] },
            where: {
                concept
            }
        }
    }))
};
//# sourceMappingURL=concepts.js.map