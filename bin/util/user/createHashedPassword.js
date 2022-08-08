"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = require("crypto");
const createHashedPassword = (password, dbSalt) => {
    try {
        let salt;
        if (dbSalt)
            salt = dbSalt;
        else
            salt = (0, crypto_1.randomBytes)(64).toString('base64');
        return new Promise((resolve, reject) => (0, crypto_1.pbkdf2)(password, salt, 9999, 64, 'sha512', (err, key) => {
            if (err)
                reject(err);
            resolve({ password: key.toString('base64'), salt });
        }));
    }
    catch (err) {
        console.log(err);
    }
};
exports.default = createHashedPassword;
//# sourceMappingURL=createHashedPassword.js.map