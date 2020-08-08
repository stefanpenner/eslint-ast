'use strict';

const csstree = require('css-tree');
function parse(code, options) {
  return JSON.parse(JSON.stringify(csstree.parse(code, {
    positions: true,
    filename: options.filename

    // filename: filename,
    // onParseError
  })))
}

function enter(node) {
  node.tokens = [];
  node.comments = [];
  node.range = [node.loc.start.offset, node.loc.end.offset];
  // transform a given node into an eslint compabible node
}

module.exports.parseForESLint = function(code, options) {
  let ast;

  const filePath = typeof options === 'object' && options !== null && options.filePath || '<unknown file>';
  try {
    ast = parse(code, options)
  } catch(e) {
    e.message = `${e.message}\n Could not parse file: ${filePath}\n File Contents:\n ${code}\n`;
    e.file = filePath;
    throw e;
  }

  // turn graphql AST into eslint compatible AST
  csstree.walk(ast, { enter });

  return {
    ast,
    // TODO: actually implement when we need it
    scopeManager: {
      scopes: [
        { set: new Map(), variables: [], through: [] }
      ],
      getDeclaredVariables() {
        debugger
      }
    },
    service: {
    },
    // to only visit certain members, feel free to add those rules to this dictionary.
    // key: NodeName
    // value: [members, of, NodeName, that, should, be visited]
    //
    // If a specific NodeName is not mentioned, it will still be traversed but
    // all its members will also be traversed. This is "fine" but not ideal, as
    // visits more of the AST then is required. This may be both slower, and
    // risk depending on a non public API for a given AST>
    visitorKeys: {
      StyleSheet: ['children']
    }
  }
};
