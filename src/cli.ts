#!/usr/bin/env node
import { program } from "commander";
import { ESLint } from "eslint";
var fs = require("fs");
var isValidGlob = require("is-valid-glob");
var packageJson = require("../package.json");
program
  .version(packageJson.version)
  .option(
    "-o, --overwrite",
    "Overwrite the file instead of creating a .tmp.tsx file.",
  )
  .option("-v, --verbose", "Shows verbose logs.")
  .option("-d, --debug", "Shows debug logs.")
  .option("-l, --lintOnly", "Only lints the file to debug eslint config.");

const options = program.opts();
program.parse();

const inputPath = program.args as string[];

if (!inputPath.length && options.verbose) {
  console.log("You didn't specify any file to be converted.");
  console.log("The flag -v is for `verbose`.");
  console.log("Use the flag -V (capital V) for `version`.");
  console.log(`The current version is ${packageJson.version}`);
}

inputPath.forEach(async (filePath) => {
  if (isValidGlob(inputPath)) {
    //Open file
    fs.readFile(filePath, "utf8", async function (err: Error, data: string) {
      if (err) {
        return console.log(err);
      }

      var result = await lintFixText(data);

      if (options.lintOnly) {
        await writeFile(filePath, result, options.overwrite);
        console.log(`LintOnly flag activated. File has been linted only.`);
        return;
      }

      //Get the component name
      verbose(`- Looking for component name.`);
      const componentNameRegex = /class (.*?) extends/gm;
      debug(`     Regex patter to be used: ${componentNameRegex}`);
      const componentNameMatcher = result.match(componentNameRegex);
      const componentName = componentNameMatcher?.length
        ? componentNameMatcher[0].replace(componentNameRegex, "$1")
        : "CouldNotFindComponentName";

      if (!componentName) {
        console.error(
          "Component name was not found in this file. Are you sure it has a 'class MyComponent extends ...' definition?",
        );
        return;
      }
      debug(`     Component name is: ${componentName}`);

      //Look for static functions
      verbose(`- Looking for static functions.`);
      const staticFunctionsRegex =
        /^  static (([a-zA-Z0-9_$]*) = (\(([a-zA-Z0-9_$:,. ]|\n){0,}?\))([a-zA-Z:.<> ]+)?( => )[({](.|\n)+?  [)}];)/gm;
      debug(`     Regex patter to be used: ${staticFunctionsRegex}`);
      const staticFunctionsMatcher = [...result.matchAll(staticFunctionsRegex)];
      debug(
        `     Found ${staticFunctionsMatcher.length} static functions in this class component.`,
      );
      if (staticFunctionsMatcher?.length) {
        for (const matcher of staticFunctionsMatcher) {
          //Remove static function from inside the class
          result = result.replace(matcher[0], "");
          //Put the static function outside at the end
          result = result.replace(
            /(class (.*?) extends (.|\n)+^})/gm,
            `$1\n
            ${componentName}.${matcher[1]}
          `,
          );
        }
      }

      result = result.replace(staticFunctionsRegex, "const $1 = ($2) => {$3}");

      //Look for `class MyComponent extends React.Component<TProps> {`
      //Replace it for `const MyComponent = (props: TProps) => {
      verbose(`- Looking for class definition.`);
      const classDefinitionRegex =
        /class (.*) extends [a-zA-Z0-9_$.]*[<]{0,1}([a-zA-Z0-9_$.]*)[,]{0,1}(.*)?[>]{0,1}.*\{/gm;
      debug(`     Regex patter to be used: ${classDefinitionRegex}`);
      result = result.replace(
        classDefinitionRegex,
        function (g1: string, g2: string, g3: string) {
          var prefix = "";
          if (g3) {
            debug(
              `     This class has the following type for its 'props': ${g3}.`,
            );
            prefix = `: ${g3}`;
          } else {
            debug(`     This class has no type for its 'props'.`);
            prefix = "";
          }
          return `const ${g2} = (props${prefix}) => {`;
        },
      );

      //Look for `export default`
      //If it exists, move the default export to the EOF
      result = result.replace(
        /export default (const (.*) = (.|\n)*)/,
        "$1;\nexport default $2;",
      );

      //Look for `constructor`
      //Leave only the block content without `super` if any
      result = result.replace(
        /^  constructor\(.*\).*\{\n(    super\(props\);)?((.|\n)+?)^  }\n/gm,
        "$2",
      );

      //Look for `componentDidMount`
      //Replace it with a default `React.useEffect` hook
      //Check if it needs to be async
      const componentDidMountRegex =
        /.*componentDidMount\(\).*\{((.|\n)+?)(^  \})\n/gm;
      const componentDidMountMatcher = result.match(componentDidMountRegex);
      if (componentDidMountMatcher?.length) {
        if (componentDidMountMatcher[0].includes("async")) {
          result = result.replace(
            componentDidMountRegex,
            `
            //Previously componentDidMount
            React.useEffect(()=>{
              const asyncEffect = async () => {
                $1
              }; 
              asyncEffect();
            }, [])
            `,
          );
        } else {
          result = result.replace(
            componentDidMountRegex,
            `
            //Previously componentDidMount
            React.useEffect(()=>{
              $1
            }, [])`,
          );
        }
      }

      //Look for `componentDidUpdate`
      //Replace it with a default `React.useEffect` hook
      //Check if it needs to be async
      const componentDidUpdateRegex =
        /.*componentDidUpdate\(([ a-zA-Z0-9_:{},]|\n)*\) ?\{((.|\n)+?)(^  \})\n/gm;
      const componentDidUpdateMatcher = result.match(componentDidUpdateRegex);
      if (componentDidUpdateMatcher?.length) {
        let comment = "";
        if (componentDidUpdateMatcher[0].includes("prevProp")) {
          comment =
            "//class-to-function: This hook does not need to compare `prevProps` with current `props`. You may delete any conditional created for this purpose, for example.";
        }
        if (componentDidUpdateMatcher[0].includes("async")) {
          result = result.replace(
            componentDidUpdateRegex,
            `
            //Previously componentDidUpdate
            React.useEffect(()=>{
              const asyncEffect = async () => {
                ${comment}
                $2
              }; 
              asyncEffect();
            }, [])
            `,
          );
        } else {
          result = result.replace(
            componentDidUpdateRegex,
            `
            //Previously componentDidUpdate
            React.useEffect(()=>{
              ${comment}
              $2
            }, [])`,
          );
        }
      }

      //Look for `componentWillUnmount`
      //Replace it with a default `React.useEffect` hook
      //Check if it needs to be async
      const componentWillUnmountRegex =
        /.*componentWillUnmount\(([ a-zA-Z0-9_:{},]|\n)*\) ?\{((.|\n)+?)(^  \})\n/gm;
      const componentWillUnmountMatcher = result.match(
        componentWillUnmountRegex,
      );
      if (componentWillUnmountMatcher?.length) {
        if (componentWillUnmountMatcher[0].includes("async")) {
          result = result.replace(
            componentWillUnmountRegex,
            `
            //Previously componentWillUnmount
            React.useEffect(()=>{
              return () => {
                const asyncEffect = async () => {
                  $2
                }; 
                asyncEffect();
              }
            }, [])
            `,
          );
        } else {
          result = result.replace(
            componentWillUnmountRegex,
            `
            //Previously componentWillUnmount
            React.useEffect(()=>{
              return () => {
                $2
              }
            }, [])`,
          );
        }
      }

      //Look for `render(): React.ReactElement<any> { ... }`
      //Leave only the inner body of the render function
      const renderBlockRegex = /^  render.*\{((.|\n)+?)(^  \})\n/gm;
      const renderBlock = result.match(renderBlockRegex);
      if (renderBlock?.length) {
        const cleanReturnFromRenderBlock = renderBlock[0].replace(
          renderBlockRegex,
          "$1",
        );

        result = result
          .replace(renderBlockRegex, "")
          .replace(
            /(const .* = \(.*\) => (.|\n)+)(^\})/gm,
            `$1${cleanReturnFromRenderBlock}$3`,
          );
      }

      result = result.replace(renderBlockRegex, "$1");

      //Look for arrow functions `handler = () => { ...`
      //Add `const` to the arrow function definition
      verbose(`- Looking for root arrow functions`);
      const arrowFunctionsRegex =
        /(?<!const) (([a-zA-Z0-9_$]*) = (\((.|\n){0,}?\))([a-zA-Z:.<> ]+)?( => )(\(|\{)(.|\n)+?^  (\)|\}));\n/gm;
      debug(`     Regex patter to be used: ${arrowFunctionsRegex}`);
      if (options.debug) {
        const arrowFunctionsMatcher = [...result.matchAll(arrowFunctionsRegex)];
        debug(
          `     Found ${
            arrowFunctionsMatcher?.length ?? 0
          } root arrow functions.`,
        );
      }
      result = result.replace(arrowFunctionsRegex, "const $1");

      //Look for common functions like `render` (`render` will not exist anymore at this point)
      result = result.replace(
        /^  ([a-zA-Z0-9_$]+)\((.*)\):?.*\{((.|\n)+?)^  \}/gm,
        "const $1 = ($2) => {$3}",
      );

      //Look for `this.forceUpdate()` calls
      //Add a dummy `useState` call for that
      const forceUpdateMatcher = result.match(/this.forceUpdate\(\)/g);
      if (forceUpdateMatcher?.length) {
        const hookDummyForceUpdate = `
        const [, updateState] = React.useState<object>();
        const forceUpdate = React.useCallback(
          () => updateState({ dummy: Math.random() }),
          [],
        );
        `;

        result = result.replace(
          /(^const (.*) => {\n)/gm,
          `$1${hookDummyForceUpdate}`,
        );
      }

      //Look for `this.`
      //Replace with nothing
      result = result.replace(/this\./g, "");

      //Look for state definition
      //  state = { ... };
      const stateDefinitionRegex = /state = \{((.|\n)+?)\};/gm;
      const stateDefinition = result.match(stateDefinitionRegex);
      let stateHooks = undefined;
      if (stateDefinition?.length) {
        if (stateDefinition.length > 1)
          throw new Error(
            "Apparently there is more than one state definition.",
          );
        else {
          const stateWithinBracketsRegex = /\{((.|\n)+?)\};/gm;
          const stateWithinBracketsDefinition = stateDefinition[0].match(
            stateWithinBracketsRegex,
          );

          //Replace each state property with `useState` hook
          const stateKeyValueRegex = /([a-zA-Z0-9_$]+):? ?(.*),? ?\n?/gm;
          stateHooks = stateWithinBracketsDefinition![0].replace(
            stateKeyValueRegex,
            (substring: string) => {
              const match = substring.match(/([a-zA-Z0-9_$]+):? ?(.*),? ?\n?/); //match won't work with /gm
              if (match?.length) {
                const key = match[1];
                const value = match[2] && match[2] !== "," ? match[2] : "";
                const setKey = `set${key[0].toUpperCase()}${key.substring(1)}`;
                return `const [${key}, ${setKey}] = React.useState(${value});`;
              } else {
                return "//@MANUAL WORK REQUIRED: there was some error when trying to parse the state definition to replace it for `React.useState()` hooks.";
              }
            },
          );

          //Clean stateHooks
          stateHooks = stateHooks.replace(stateDefinitionRegex, "$1");
          stateHooks = stateHooks.replace(stateWithinBracketsRegex, "$1");

          //Finally replace the state definition with state hooks
          result = result.replace(stateDefinition[0], stateHooks);
        }
      }

      //Look for single setState
      verbose(`- Looking for single 'setState' calls.`);
      const singleSetStateRegex =
        /^[ ]*setState\(\{ ?\n?(([ a-zA-Z0-9_$()&|!.:,]|\n)+)\}\);/gm;
      debug(`     Regex patter to be used: ${singleSetStateRegex}`);

      const singleSetStates = [...result.matchAll(singleSetStateRegex)];
      debug(
        `     Found ${singleSetStates?.length ?? 0} single 'setState' calls.`,
      );

      if (singleSetStates?.length) {
        for (const matcher of singleSetStates) {
          const singleSetStateProperties = matcher[1];
          let newSetStateHookBlock = "";

          //Check if it contains commas
          if (singleSetStateProperties.includes(",")) {
            //It likely has more than one state property being set
            const splitProperties = singleSetStateProperties.split(",");
            for (const prop of splitProperties) {
              const propTrimmed = prop.trim();
              if (propTrimmed != "")
                newSetStateHookBlock += `${replaceStateKeyValueBySetHook(
                  propTrimmed,
                )}\n`;
            }
          } else {
            //It's likely already a single line property
            const propTrimmed = singleSetStateProperties.trim();
            newSetStateHookBlock += `${replaceStateKeyValueBySetHook(
              propTrimmed,
            )}\n`;
          }
          result = result.replace(matcher[0], newSetStateHookBlock);
        }
      }

      //Look for `state.myProperty`
      //Replace it with `myProperty` only
      result = result.replace(/state\.([ a-zA-Z0-9_$:,]+)/, "$1");

      //Look for `const { ... } = state` (state destructuring) and clean it
      result = result.replace(
        /^[ ]+const \{([ a-zA-Z0-9_:{},]|\n)*?\} = state;?\n/gm,
        "",
      );

      //@TODO: look for setState with callback, replace it with useEffect for callback
      //@TODO: look for setState with prevProp

      //Write file
      await writeFile(filePath, result, options.overwrite);
    });
  } else {
    program.error(`Invalid glob pattern (file path): ${inputPath}`);
  }
});

function verbose(message: string) {
  if (options?.verbose) {
    console.log(message);
  }
}

function debug(message: string) {
  if (options?.debug) {
    console.debug(message);
  }
}

function replaceStateKeyValueBySetHook(stateKeyValue: string) {
  //Check if it has `:` separator
  if (stateKeyValue.includes(":")) {
    const [key, value] = stateKeyValue.trim().split(":");
    const hookSetState = `set${key[0].toUpperCase()}${key.substring(
      1,
    )}(${value.trim()});`;
    return hookSetState;
  } else {
    //If it does not have `:` separator, it's single inline like setState({ myPropertyValue })
    const key = stateKeyValue;
    const hookSetState = `set${key[0].toUpperCase()}${key.substring(
      1,
    )}(${key});`;
    return hookSetState;
  }
}

//Format (--fix) text with ESLint AFTER running script
//This makes sure local blocks and expressions have empty lines in between them, for example
async function lintFixText(text: string) {
  verbose("- Starting linting-fixing text.");
  try {
    const eslint = new ESLint({
      fix: true,
      cwd: `${__dirname}/eslint-api/ts/`,
    });
    const result = await eslint.lintText(text);
    return result?.[0].output ? result[0].output : "Lint failed.";
  } catch (error) {
    console.log(error);
    return `There was some error linting text: ${JSON.stringify(error)}`;
  }
}

async function writeFile(
  filePath: string,
  codeInput: string,
  shouldOverWrite: boolean,
) {
  const lintedCodeInput = await lintFixText(codeInput);
  const actualFilePath = shouldOverWrite ? filePath : `${filePath}.tmp.tsx`;
  fs.writeFile(
    actualFilePath,
    lintedCodeInput,
    "utf8",
    async function (err: Error) {
      verbose(`- File has been written to ${actualFilePath}`);
      if (err) return console.log(err);
    },
  );
}
