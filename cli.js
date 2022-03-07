#!/usr/bin/env node
const { execSync } = require("child_process");
const { ESLint } = require("eslint");
const { program } = require("commander");
var fs = require("fs");
var isValidGlob = require("is-valid-glob");

program.option("--overwrite");

const options = program.opts();
program.parse();

const inputPath = program.args;
inputPath.forEach(async filePath => {
  if (isValidGlob(inputPath)) {
    //Make a .tmp copy
    execSync(`cp ${filePath} ${filePath}.tmp.tsx`);
    //Format (--fix) file with ESLint before running script
    //This makes sure class members have empty lines in between them, for instance
    await lintFixFile(`${filePath}.tmp.tsx`);

    //Open temp file
    fs.readFile(`${filePath}.tmp.tsx`, "utf8", async function(err, data) {
      if (err) {
        d;
        return console.log(err);
      }

      //Look for `class MyComponent extends React.Component<TProps> {`
      //Replace it for `const MyComponent = (props: TProps) => {
      var result = data.replace(
        /class (.*) extends .*<?([a-zA-Z0-9_$]*)[,]{0,1}(.*)?>?.*\{/gm,
        function(g1, g2, g3) {
          var prefix = "";
          if (g3) {
            prefix = `: ${g3}`;
          } else {
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
      const componentDidMountRegex = /.*componentDidMount\(\).*\{((.|\n)+?)(^  \})\n/gm;
      const componentDidMountMatcher = result.match(componentDidMountRegex);
      if (componentDidMountMatcher?.length) {
        if (componentDidMountMatcher[0].includes("async")) {
          result = result.replace(
            componentDidMountRegex,
            `
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
            "React.useEffect(()=>{$1}, [])",
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
      result = result.replace(
        /(?<!const) (([a-zA-Z0-9_$]*) = \((.|\n)*?\)[ ]*=>[ ]*\{)/g,
        "const $1",
      );

      //Look for common functions like `render` (`render` will not exist anymore at this point)
      result = result.replace(
        /^  ([a-zA-Z0-9_$]+)\((.*)\):?.*\{((.|\n)+)^  \}/gm,
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
          //Replace each state property with `useState` hook
          stateHooks = stateDefinition[0].replace(
            /([a-zA-Z0-9_$]+): (.*),/g,
            substring => {
              const match = substring.match(/([a-zA-Z0-9_$]+): (.*),/);
              const key = match[1];
              const value = match[2];
              const setKey = `set${key[0].toUpperCase()}${key.substring(1)}`;
              return `const [${key}, ${setKey}] = React.useState(${value});`;
            },
          );

          //Clean state hooks
          stateHooks = stateHooks.replace(stateDefinitionRegex, "$1");

          //Finally replace the state definition with state hooks
          result = result.replace(stateDefinition[0], stateHooks);
        }
      }

      //Look for single setState
      const singleSetStates = [
        ...result.matchAll(
          /setState\(\{ ?\n?(([ a-zA-Z0-9_$:,]+|\n)+)\}\);\n/g,
        ),
      ];
      if (singleSetStates?.length) {
        for (const matcher of singleSetStates) {
          const singleSetStateProperties = matcher[1];
          let newSetStateHookBlock = "";

          //Check if it contains commas
          if (singleSetStateProperties.includes(",")) {
            //It likety has more than one state property being set
            const splitProperties = singleSetStateProperties.split(",");
            for (const prop of splitProperties) {
              const propTrimmed = prop.trim();
              if (propTrimmed != "")
                newSetStateHookBlock += `${processStateProperty(
                  propTrimmed,
                  matcher[0],
                  matcher[0],
                )}\n`;
            }
          } else {
            //It's likely already a single line property
            const propTrimmed = singleSetStateProperties.trim();
            newSetStateHookBlock += `${processStateProperty(
              propTrimmed,
              matcher[0],
              matcher[0],
            )}\n`;
          }
          result = result.replace(matcher[0], newSetStateHookBlock);
        }
      }

      //Look for `state.myProperty`
      //Replace it with `myProperty` only
      result = result.replace(/state\.([ a-zA-Z0-9_$:,]+)/, "$1");

      //@TODO: look for setState with callback, replace it with useEffect for callback
      //@TODO: look for setState with prevProp

      //Write file and set `true` for shouldLintFix
      await writeFile(filePath, result, true, options.overwrite);
      if (options.overwrite)
        fs.unlink(`${filePath}.tmp.tsx`, err => {
          if (err) {
            console.error(err);
          }
        });
    });
  } else {
    program.error(`Invalid glob pattern (file path): ${inputPath}`);
  }
});

function processStateProperty(propLine) {
  //Check if it has `:` separator
  if (propLine.includes(":")) {
    const [key, value] = propLine.trim().split(":");
    const hookSetState = `set${key[0].toUpperCase()}${key.substring(
      1,
    )}(${value.trim()});`;
    return hookSetState;
  } else {
    //If it does not have `:` separator, it's single inline like setState({ myPropertyValue })
    const key = propLine;
    const hookSetState = `set${key[0].toUpperCase()}${key.substring(
      1,
    )}(${key});`;
    return hookSetState;
  }
}

//Format (--fix) file with ESLint AFTER running script
//This makes sure local blocks and expressions have empty lines in between them, for instance
async function lintFixFile(filePath) {
  console.log("Starting linting-fixing file", filePath);
  try {
    const eslint = new ESLint({
      fix: true,
      overrideConfigFile: `${__dirname}/eslint-api/.eslintrc.ts.json`,
    });
    const results = await eslint.lintFiles(filePath);
    await ESLint.outputFixes(results);
  } catch (error) {
    //@TODO: add verbose option
    console.log(error);
  }
}

async function writeFile(filePath, input, shouldLintFix, shouldOverWrite) {
  const actualFilePath = shouldOverWrite ? filePath : `${filePath}.tmp.tsx`;
  fs.writeFile(actualFilePath, input, "utf8", async function(err) {
    console.log("File has been written.", actualFilePath);
    if (err) return console.log(err);
    if (shouldLintFix) await lintFixFile(actualFilePath);
  });
}
