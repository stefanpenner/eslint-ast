'use strict';
const IMPORT_REGEXP = /^#import (?:'([^']+)'|"([^"]+)")$/;

module.exports = function matchImport(value) {
  if (typeof value !== 'string') { return null; }
  const matched = value.match(IMPORT_REGEXP);
  if (matched === null) { return null; }
  const [, importIdentifierA, importIdentifierB] = value.match(IMPORT_REGEXP)
  if (importIdentifierA === undefined && importIdentifierB === undefined) { return null; }
  return { importIdentifier: importIdentifierA || importIdentifierB };
};

