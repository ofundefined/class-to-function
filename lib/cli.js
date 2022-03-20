#!/usr/bin/env node
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
Object.defineProperty(exports, "__esModule", { value: true });
var commander_1 = require("commander");
var eslint_1 = require("eslint");
var fs = require("fs");
var isValidGlob = require("is-valid-glob");
var packageJson = require("../package.json");
commander_1.program
    .version(packageJson.version)
    .option("-o, --overwrite", "Overwrite the file instead of creating a .tmp.tsx file.")
    .option("-v, --verbose", "Shows verbose logs.")
    .option("-d, --debug", "Shows debug logs.")
    .option("-l, --lintOnly", "Only lints the file to debug eslint config.");
var options = commander_1.program.opts();
commander_1.program.parse();
var inputPath = commander_1.program.args;
if (!inputPath.length && options.verbose) {
    console.log("You didn't specify any file to be converted.");
    console.log("The flag -v is for `verbose`.");
    console.log("Use the flag -V (capital V) for `version`.");
    console.log("The current version is ".concat(packageJson.version));
}
inputPath.forEach(function (filePath) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        if (isValidGlob(inputPath)) {
            //Open file
            fs.readFile(filePath, "utf8", function (err, data) {
                var _a, _b;
                return __awaiter(this, void 0, void 0, function () {
                    var result, componentNameRegex, componentNameMatcher, componentName, staticFunctionsRegex, staticFunctionsMatcher, staticFunctionsMatcher_1, staticFunctionsMatcher_1_1, matcher, classDefinitionRegex, componentDidMountRegex, componentDidMountMatcher, componentDidUpdateRegex, componentDidUpdateMatcher, comment, componentWillUnmountRegex, componentWillUnmountMatcher, renderBlockRegex, renderBlock, cleanReturnFromRenderBlock, arrowFunctionsRegex, arrowFunctionsMatcher, forceUpdateMatcher, hookDummyForceUpdate, stateDefinitionRegex, stateDefinition, stateHooks, stateWithinBracketsRegex, stateWithinBracketsDefinition, stateKeyValueRegex, singleSetStateRegex, singleSetStates, singleSetStates_1, singleSetStates_1_1, matcher, singleSetStateProperties, newSetStateHookBlock, splitProperties, splitProperties_1, splitProperties_1_1, prop, propTrimmed, propTrimmed;
                    var e_1, _c, e_2, _d, e_3, _e;
                    return __generator(this, function (_f) {
                        switch (_f.label) {
                            case 0:
                                if (err) {
                                    return [2 /*return*/, console.log(err)];
                                }
                                return [4 /*yield*/, lintFixText(data)];
                            case 1:
                                result = _f.sent();
                                if (!options.lintOnly) return [3 /*break*/, 3];
                                return [4 /*yield*/, writeFile(filePath, result, options.overwrite)];
                            case 2:
                                _f.sent();
                                console.log("LintOnly flag activated. File has been linted only.");
                                return [2 /*return*/];
                            case 3:
                                //Get the component name
                                verbose("- Looking for component name.");
                                componentNameRegex = /class (.*?) extends/gm;
                                debug("     Regex patter to be used: ".concat(componentNameRegex));
                                componentNameMatcher = result.match(componentNameRegex);
                                componentName = (componentNameMatcher === null || componentNameMatcher === void 0 ? void 0 : componentNameMatcher.length)
                                    ? componentNameMatcher[0].replace(componentNameRegex, "$1")
                                    : "CouldNotFindComponentName";
                                if (!componentName) {
                                    console.error("Component name was not found in this file. Are you sure it has a 'class MyComponent extends ...' definition?");
                                    return [2 /*return*/];
                                }
                                debug("     Component name is: ".concat(componentName));
                                //Look for static functions
                                verbose("- Looking for static functions.");
                                staticFunctionsRegex = /^  static (([a-zA-Z0-9_$]*) = (\(([a-zA-Z0-9_$:,. ]|\n){0,}?\))([a-zA-Z:.<> ]+)?( => )[({](.|\n)+?  [)}];)/gm;
                                debug("     Regex patter to be used: ".concat(staticFunctionsRegex));
                                staticFunctionsMatcher = __spreadArray([], __read(result.matchAll(staticFunctionsRegex)), false);
                                debug("     Found ".concat(staticFunctionsMatcher.length, " static functions in this class component."));
                                if (staticFunctionsMatcher === null || staticFunctionsMatcher === void 0 ? void 0 : staticFunctionsMatcher.length) {
                                    try {
                                        for (staticFunctionsMatcher_1 = __values(staticFunctionsMatcher), staticFunctionsMatcher_1_1 = staticFunctionsMatcher_1.next(); !staticFunctionsMatcher_1_1.done; staticFunctionsMatcher_1_1 = staticFunctionsMatcher_1.next()) {
                                            matcher = staticFunctionsMatcher_1_1.value;
                                            //Remove static function from inside the class
                                            result = result.replace(matcher[0], "");
                                            //Put the static function outside at the end
                                            result = result.replace(/(class (.*?) extends (.|\n)+^})/gm, "$1\n\n            ".concat(componentName, ".").concat(matcher[1], "\n          "));
                                        }
                                    }
                                    catch (e_1_1) { e_1 = { error: e_1_1 }; }
                                    finally {
                                        try {
                                            if (staticFunctionsMatcher_1_1 && !staticFunctionsMatcher_1_1.done && (_c = staticFunctionsMatcher_1.return)) _c.call(staticFunctionsMatcher_1);
                                        }
                                        finally { if (e_1) throw e_1.error; }
                                    }
                                }
                                result = result.replace(staticFunctionsRegex, "const $1 = ($2) => {$3}");
                                //Look for `class MyComponent extends React.Component<TProps> {`
                                //Replace it for `const MyComponent = (props: TProps) => {
                                verbose("- Looking for class definition.");
                                classDefinitionRegex = /class (.*) extends [a-zA-Z0-9_$.]*[<]{0,1}([a-zA-Z0-9_$.]*)[,]{0,1}(.*)?[>]{0,1}.*\{/gm;
                                debug("     Regex patter to be used: ".concat(classDefinitionRegex));
                                result = result.replace(classDefinitionRegex, function (g1, g2, g3) {
                                    var prefix = "";
                                    if (g3) {
                                        debug("     This class has the following type for its 'props': ".concat(g3, "."));
                                        prefix = ": ".concat(g3);
                                    }
                                    else {
                                        debug("     This class has no type for its 'props'.");
                                        prefix = "";
                                    }
                                    return "const ".concat(g2, " = (props").concat(prefix, ") => {");
                                });
                                //Look for `export default`
                                //If it exists, move the default export to the EOF
                                result = result.replace(/export default (const (.*) = (.|\n)*)/, "$1;\nexport default $2;");
                                //Look for `constructor`
                                //Leave only the block content without `super` if any
                                result = result.replace(/^  constructor\(.*\).*\{\n(    super\(props\);)?((.|\n)+?)^  }\n/gm, "$2");
                                componentDidMountRegex = /.*componentDidMount\(\).*\{((.|\n)+?)(^  \})\n/gm;
                                componentDidMountMatcher = result.match(componentDidMountRegex);
                                if (componentDidMountMatcher === null || componentDidMountMatcher === void 0 ? void 0 : componentDidMountMatcher.length) {
                                    if (componentDidMountMatcher[0].includes("async")) {
                                        result = result.replace(componentDidMountRegex, "\n            //Previously componentDidMount\n            React.useEffect(()=>{\n              const asyncEffect = async () => {\n                $1\n              }; \n              asyncEffect();\n            }, [])\n            ");
                                    }
                                    else {
                                        result = result.replace(componentDidMountRegex, "\n            //Previously componentDidMount\n            React.useEffect(()=>{\n              $1\n            }, [])");
                                    }
                                }
                                componentDidUpdateRegex = /.*componentDidUpdate\(([ a-zA-Z0-9_:{},]|\n)*\) ?\{((.|\n)+?)(^  \})\n/gm;
                                componentDidUpdateMatcher = result.match(componentDidUpdateRegex);
                                if (componentDidUpdateMatcher === null || componentDidUpdateMatcher === void 0 ? void 0 : componentDidUpdateMatcher.length) {
                                    comment = "";
                                    if (componentDidUpdateMatcher[0].includes("prevProp")) {
                                        comment =
                                            "//class-to-function: This hook does not need to compare `prevProps` with current `props`. You may delete any conditional created for this purpose, for example.";
                                    }
                                    if (componentDidUpdateMatcher[0].includes("async")) {
                                        result = result.replace(componentDidUpdateRegex, "\n            //Previously componentDidUpdate\n            React.useEffect(()=>{\n              const asyncEffect = async () => {\n                ".concat(comment, "\n                $2\n              }; \n              asyncEffect();\n            }, [])\n            "));
                                    }
                                    else {
                                        result = result.replace(componentDidUpdateRegex, "\n            //Previously componentDidUpdate\n            React.useEffect(()=>{\n              ".concat(comment, "\n              $2\n            }, [])"));
                                    }
                                }
                                componentWillUnmountRegex = /.*componentWillUnmount\(([ a-zA-Z0-9_:{},]|\n)*\) ?\{((.|\n)+?)(^  \})\n/gm;
                                componentWillUnmountMatcher = result.match(componentWillUnmountRegex);
                                if (componentWillUnmountMatcher === null || componentWillUnmountMatcher === void 0 ? void 0 : componentWillUnmountMatcher.length) {
                                    if (componentWillUnmountMatcher[0].includes("async")) {
                                        result = result.replace(componentWillUnmountRegex, "\n            //Previously componentWillUnmount\n            React.useEffect(()=>{\n              return () => {\n                const asyncEffect = async () => {\n                  $2\n                }; \n                asyncEffect();\n              }\n            }, [])\n            ");
                                    }
                                    else {
                                        result = result.replace(componentWillUnmountRegex, "\n            //Previously componentWillUnmount\n            React.useEffect(()=>{\n              return () => {\n                $2\n              }\n            }, [])");
                                    }
                                }
                                renderBlockRegex = /^  render.*\{((.|\n)+?)(^  \})\n/gm;
                                renderBlock = result.match(renderBlockRegex);
                                if (renderBlock === null || renderBlock === void 0 ? void 0 : renderBlock.length) {
                                    cleanReturnFromRenderBlock = renderBlock[0].replace(renderBlockRegex, "$1");
                                    result = result
                                        .replace(renderBlockRegex, "")
                                        .replace(/(const .* = \(.*\) => (.|\n)+)(^\})/gm, "$1".concat(cleanReturnFromRenderBlock, "$3"));
                                }
                                result = result.replace(renderBlockRegex, "$1");
                                //Look for arrow functions `handler = () => { ...`
                                //Add `const` to the arrow function definition
                                verbose("- Looking for root arrow functions");
                                arrowFunctionsRegex = /(?<!const) (([a-zA-Z0-9_$]*) = (\((.|\n){0,}?\))([a-zA-Z:.<> ]+)?( => )(\(|\{)(.|\n)+?^  (\)|\}));\n/gm;
                                debug("     Regex patter to be used: ".concat(arrowFunctionsRegex));
                                if (options.debug) {
                                    arrowFunctionsMatcher = __spreadArray([], __read(result.matchAll(arrowFunctionsRegex)), false);
                                    debug("     Found ".concat((_a = arrowFunctionsMatcher === null || arrowFunctionsMatcher === void 0 ? void 0 : arrowFunctionsMatcher.length) !== null && _a !== void 0 ? _a : 0, " root arrow functions."));
                                }
                                result = result.replace(arrowFunctionsRegex, "const $1");
                                //Look for common functions like `render` (`render` will not exist anymore at this point)
                                result = result.replace(/^  ([a-zA-Z0-9_$]+)\((.*)\):?.*\{((.|\n)+?)^  \}/gm, "const $1 = ($2) => {$3}");
                                forceUpdateMatcher = result.match(/this.forceUpdate\(\)/g);
                                if (forceUpdateMatcher === null || forceUpdateMatcher === void 0 ? void 0 : forceUpdateMatcher.length) {
                                    hookDummyForceUpdate = "\n        const [, updateState] = React.useState<object>();\n        const forceUpdate = React.useCallback(\n          () => updateState({ dummy: Math.random() }),\n          [],\n        );\n        ";
                                    result = result.replace(/(^const (.*) => {\n)/gm, "$1".concat(hookDummyForceUpdate));
                                }
                                //Look for `this.`
                                //Replace with nothing
                                result = result.replace(/this\./g, "");
                                stateDefinitionRegex = /state = \{((.|\n)+?)\};/gm;
                                stateDefinition = result.match(stateDefinitionRegex);
                                stateHooks = undefined;
                                if (stateDefinition === null || stateDefinition === void 0 ? void 0 : stateDefinition.length) {
                                    if (stateDefinition.length > 1)
                                        throw new Error("Apparently there is more than one state definition.");
                                    else {
                                        stateWithinBracketsRegex = /\{((.|\n)+?)\};/gm;
                                        stateWithinBracketsDefinition = stateDefinition[0].match(stateWithinBracketsRegex);
                                        stateKeyValueRegex = /([a-zA-Z0-9_$]+):? ?(.*),? ?\n?/gm;
                                        stateHooks = stateWithinBracketsDefinition[0].replace(stateKeyValueRegex, function (substring) {
                                            var match = substring.match(/([a-zA-Z0-9_$]+):? ?(.*),? ?\n?/); //match won't work with /gm
                                            if (match === null || match === void 0 ? void 0 : match.length) {
                                                var key = match[1];
                                                var value = match[2] && match[2] !== "," ? match[2] : "";
                                                var setKey = "set".concat(key[0].toUpperCase()).concat(key.substring(1));
                                                return "const [".concat(key, ", ").concat(setKey, "] = React.useState(").concat(value, ");");
                                            }
                                            else {
                                                return "//@MANUAL WORK REQUIRED: there was some error when trying to parse the state definition to replace it for `React.useState()` hooks.";
                                            }
                                        });
                                        //Clean stateHooks
                                        stateHooks = stateHooks.replace(stateDefinitionRegex, "$1");
                                        stateHooks = stateHooks.replace(stateWithinBracketsRegex, "$1");
                                        //Finally replace the state definition with state hooks
                                        result = result.replace(stateDefinition[0], stateHooks);
                                    }
                                }
                                //Look for single setState
                                verbose("- Looking for single 'setState' calls.");
                                singleSetStateRegex = /^[ ]*setState\(\{ ?\n?(([ a-zA-Z0-9_$()&|!.:,]|\n)+)\}\);/gm;
                                debug("     Regex patter to be used: ".concat(singleSetStateRegex));
                                singleSetStates = __spreadArray([], __read(result.matchAll(singleSetStateRegex)), false);
                                debug("     Found ".concat((_b = singleSetStates === null || singleSetStates === void 0 ? void 0 : singleSetStates.length) !== null && _b !== void 0 ? _b : 0, " single 'setState' calls."));
                                if (singleSetStates === null || singleSetStates === void 0 ? void 0 : singleSetStates.length) {
                                    try {
                                        for (singleSetStates_1 = __values(singleSetStates), singleSetStates_1_1 = singleSetStates_1.next(); !singleSetStates_1_1.done; singleSetStates_1_1 = singleSetStates_1.next()) {
                                            matcher = singleSetStates_1_1.value;
                                            singleSetStateProperties = matcher[1];
                                            newSetStateHookBlock = "";
                                            //Check if it contains commas
                                            if (singleSetStateProperties.includes(",")) {
                                                splitProperties = singleSetStateProperties.split(",");
                                                try {
                                                    for (splitProperties_1 = (e_3 = void 0, __values(splitProperties)), splitProperties_1_1 = splitProperties_1.next(); !splitProperties_1_1.done; splitProperties_1_1 = splitProperties_1.next()) {
                                                        prop = splitProperties_1_1.value;
                                                        propTrimmed = prop.trim();
                                                        if (propTrimmed != "")
                                                            newSetStateHookBlock += "".concat(replaceStateKeyValueBySetHook(propTrimmed), "\n");
                                                    }
                                                }
                                                catch (e_3_1) { e_3 = { error: e_3_1 }; }
                                                finally {
                                                    try {
                                                        if (splitProperties_1_1 && !splitProperties_1_1.done && (_e = splitProperties_1.return)) _e.call(splitProperties_1);
                                                    }
                                                    finally { if (e_3) throw e_3.error; }
                                                }
                                            }
                                            else {
                                                propTrimmed = singleSetStateProperties.trim();
                                                newSetStateHookBlock += "".concat(replaceStateKeyValueBySetHook(propTrimmed), "\n");
                                            }
                                            result = result.replace(matcher[0], newSetStateHookBlock);
                                        }
                                    }
                                    catch (e_2_1) { e_2 = { error: e_2_1 }; }
                                    finally {
                                        try {
                                            if (singleSetStates_1_1 && !singleSetStates_1_1.done && (_d = singleSetStates_1.return)) _d.call(singleSetStates_1);
                                        }
                                        finally { if (e_2) throw e_2.error; }
                                    }
                                }
                                //Look for `state.myProperty`
                                //Replace it with `myProperty` only
                                result = result.replace(/state\.([ a-zA-Z0-9_$:,]+)/, "$1");
                                //Look for `const { ... } = state` (state destructuring) and clean it
                                result = result.replace(/^[ ]+const \{([ a-zA-Z0-9_:{},]|\n)*?\} = state;?\n/gm, "");
                                //@TODO: look for setState with callback, replace it with useEffect for callback
                                //@TODO: look for setState with prevProp
                                //Write file
                                return [4 /*yield*/, writeFile(filePath, result, options.overwrite)];
                            case 4:
                                //@TODO: look for setState with callback, replace it with useEffect for callback
                                //@TODO: look for setState with prevProp
                                //Write file
                                _f.sent();
                                return [2 /*return*/];
                        }
                    });
                });
            });
        }
        else {
            commander_1.program.error("Invalid glob pattern (file path): ".concat(inputPath));
        }
        return [2 /*return*/];
    });
}); });
function verbose(message) {
    if (options === null || options === void 0 ? void 0 : options.verbose) {
        console.log(message);
    }
}
function debug(message) {
    if (options === null || options === void 0 ? void 0 : options.debug) {
        console.debug(message);
    }
}
function replaceStateKeyValueBySetHook(stateKeyValue) {
    //Check if it has `:` separator
    if (stateKeyValue.includes(":")) {
        var _a = __read(stateKeyValue.trim().split(":"), 2), key = _a[0], value = _a[1];
        var hookSetState = "set".concat(key[0].toUpperCase()).concat(key.substring(1), "(").concat(value.trim(), ");");
        return hookSetState;
    }
    else {
        //If it does not have `:` separator, it's single inline like setState({ myPropertyValue })
        var key = stateKeyValue;
        var hookSetState = "set".concat(key[0].toUpperCase()).concat(key.substring(1), "(").concat(key, ");");
        return hookSetState;
    }
}
//Format (--fix) text with ESLint AFTER running script
//This makes sure local blocks and expressions have empty lines in between them, for example
function lintFixText(text) {
    return __awaiter(this, void 0, void 0, function () {
        var eslint, result, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    verbose("- Starting linting-fixing text.");
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    eslint = new eslint_1.ESLint({
                        fix: true,
                        cwd: "".concat(__dirname, "/eslint-api/ts/"),
                    });
                    return [4 /*yield*/, eslint.lintText(text)];
                case 2:
                    result = _a.sent();
                    return [2 /*return*/, (result === null || result === void 0 ? void 0 : result[0].output) ? result[0].output : "Lint failed."];
                case 3:
                    error_1 = _a.sent();
                    console.log(error_1);
                    return [2 /*return*/, "There was some error linting text: ".concat(JSON.stringify(error_1))];
                case 4: return [2 /*return*/];
            }
        });
    });
}
function writeFile(filePath, codeInput, shouldOverWrite) {
    return __awaiter(this, void 0, void 0, function () {
        var actualFilePath;
        return __generator(this, function (_a) {
            actualFilePath = shouldOverWrite ? filePath : "".concat(filePath, ".tmp.tsx");
            fs.writeFile(actualFilePath, codeInput, "utf8", function (err) {
                return __awaiter(this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        verbose("- File has been written to ".concat(actualFilePath));
                        if (err)
                            return [2 /*return*/, console.log(err)];
                        return [2 /*return*/];
                    });
                });
            });
            return [2 /*return*/];
        });
    });
}
