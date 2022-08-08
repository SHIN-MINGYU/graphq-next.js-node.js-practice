"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function authErrorCheck(context) {
    var _a;
    if (typeof context.deserializeUser !== "string") {
        if ((_a = context.deserializeUser) === null || _a === void 0 ? void 0 : _a.authError) {
            throw context.deserializeUser.authError;
        }
        else {
            throw new Error("GUEST");
        }
    }
    return;
}
exports.default = authErrorCheck;
//# sourceMappingURL=authError.js.map