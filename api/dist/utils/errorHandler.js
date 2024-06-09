"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const handleServerError = (res, error, functionName) => {
    console.error(`Error in ${functionName} controller:`, error.message);
    res.status(500).json({ error: error.message });
};
exports.default = handleServerError;
