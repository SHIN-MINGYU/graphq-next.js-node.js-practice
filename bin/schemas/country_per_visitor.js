"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const contry_per_visitor_schema = new mongoose_1.Schema({
    contry_code: String,
    count: Number,
});
exports.default = (0, mongoose_1.model)("contry_per_visitor", contry_per_visitor_schema);
//# sourceMappingURL=country_per_visitor.js.map