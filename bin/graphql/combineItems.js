"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function combineItems(...items) {
    let rootItems = items[0];
    for (let i = 1; i < items.length; i++) {
        rootItems = Object.assign(items[i], rootItems);
    }
    return rootItems;
}
exports.default = combineItems;
//# sourceMappingURL=combineItems.js.map