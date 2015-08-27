#!/usr/bin/env node

'use strict';

var meow = require('meow');
var ManiVer = require('./');
var path = require('path');
var fs = require('fs');

var cli = meow({
	help: [
		'Usage',
	  '  maniver <path> [build | maintenance | minor | major]',
		'',
	  'Example',
	  '  maniver manifest.json maintenance',
		''
	]
});

try {
  var manifestPath = path.relative(process.cwd(), cli.input[0]);
  var manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

  if (!manifest) {
    throw new Error('Invalid input file');
  } else if (!manifest.version) {
    throw new Error('Manifest has no version data');
  }

  var maniver = new ManiVer(manifest.version);
  var versionup = maniver[cli.input[1]];

  if (!versionup) {
    throw new Error('Invlaid options', cli.input[1]);
  }

  manifest.version = versionup.apply(maniver).version();

  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, '\t'));

  console.log(manifestPath, 'has been updated to ', manifest.version);
} catch (e) {
  console.error(e);
}
