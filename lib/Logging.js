"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorLog = exports.DebugLog = exports.InfoLog = exports.Log = void 0;
const Debug = require("debug");
let infoLogger = Debug('botFramework:graphDialog:info');
exports.Log = infoLogger;
exports.InfoLog = infoLogger;
let debugLogger = Debug('botFramework:graphDialog:debug');
exports.DebugLog = debugLogger;
let errorLogger = Debug('botFramework:graphDialog:error');
exports.ErrorLog = errorLogger;
infoLogger.log = console.log.bind(console);
debugLogger.log = console.log.bind(console);
exports.default = debugLogger;
