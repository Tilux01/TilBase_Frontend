const fs = require('fs');
const path = require('path');
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const generator = require('@babel/generator').default;

const files = [
  "Pages/ProjectDetail.jsx",
  "Pages/ProjectSaveLoader.jsx",
  "Pages/AdminPortal.jsx",
  "DataBaseComponent/GraphExplorer.jsx",
  "DataBaseComponent/Support.jsx",
  "DataBaseComponent/FlatExplorer.jsx",
  "DataBaseComponent/Backup.jsx",
  "DataBaseComponent/VectorExplorer.jsx",
  "DataBaseComponent/DocumentExplorer.jsx",
  "DataBaseComponent/NewCluster.jsx",
  "DataBaseComponent/Clusters.jsx",
  "DataBaseComponent/HierarchicalExplorer.jsx",
  "DataBaseComponent/Security.jsx",
  "DataBaseComponent/Loader.jsx",
  "DataBaseComponent/Settings.jsx",
  "DataBaseComponent/Payment.jsx",
  "DataBaseComponent/RealtimeExplorer.jsx"
];

const basePath = "/home/tilux/Documents/React Js/TIlBase/TilBase FrontEnd/src";

files.forEach(file => {
  const filePath = path.join(basePath, file);
  if (!fs.existsSync(filePath)) return;
  
  let code = fs.readFileSync(filePath, "utf8");
  try {
    const ast = parser.parse(code, {
      sourceType: "module",
      plugins: ["jsx"]
    });

    let changed = false;

    traverse(ast, {
      AwaitExpression(path) {
        let parentFunc = path.getFunctionParent();
        if (parentFunc && !parentFunc.node.async) {
          parentFunc.node.async = true;
          changed = true;
        }
      }
    });

    if (changed) {
      // Retain formatting as much as possible
      const output = generator(ast, { retainLines: true }, code);
      fs.writeFileSync(filePath, output.code);
      console.log(`Fixed async in ${file}`);
    }
  } catch(e) {
    console.error(`Error parsing ${file}:`, e);
  }
});
