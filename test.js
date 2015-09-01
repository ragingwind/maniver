'use strict';
var assert = require('assert');
var path = require('path');
var fs = require('fs');
var ManiVer = require('./');

it('should returns valid version has valid format', function () {
  var maniver = new ManiVer();
  assert.equal(maniver.version(), '0.0.0');

  maniver.version('1');
  assert.equal(maniver.version(), '1');

  maniver.version('1.0');
  assert.equal(maniver.version(), '1.0');

  maniver.version('1.0.9');
  assert.equal(maniver.version(), '1.0.9');

  maniver.version('1.0.9.102');
  assert.equal(maniver.version(), '1.0.9.102');

  maniver.version('1.0.9.102.00');
  assert.equal(maniver.version(), '1.0.9.102');
  assert.notEqual(maniver.version(), '1.0.9.102.00');

  maniver.version('01.0.9.102');
  assert.equal(maniver.version(), '1.0.9.102');
  assert.notEqual(maniver.version(), '01.0.9.102');

  maniver.version('1.099.9.102');
  assert.equal(maniver.version(), '1.0.9.102');
  assert.notEqual(maniver.version(), '1.099.9.102');

  maniver.version('1.12333.100000.102');
  assert.equal(maniver.version(), '1.0.9.102');
  assert.notEqual(maniver.version(), '1.12333.100000.102');
});

it('should returns valid updated build version', function () {
  var maniver = new ManiVer();
  maniver.build();
  assert.equal(maniver.version(), '0.0.0.1');

  maniver.version('1');
  maniver.build();
  assert.equal(maniver.version(), '1.0.0.1');

  maniver.version('1.0.0.9');
  maniver.build();
  assert.equal(maniver.version(), '1.0.0.10');

  maniver.version('1.0.0.9');
  maniver.build();
  maniver.build();
  assert.equal(maniver.version(), '1.0.0.11');

  maniver.version('1.0.0.65535');
  maniver.build();
  assert.equal(maniver.version(), '1.0.1.0');

  maniver.version('65535.65535.65535.65535');
  maniver.build();
  assert.equal(maniver.version(), '65535.65535.65535.65535');
});

it('should returns valid updated maintenance version', function () {
  var maniver = new ManiVer();
  maniver.maintenance();
  assert.equal(maniver.version(), '0.0.1');

  maniver.maintenance();
  assert.equal(maniver.version(), '0.0.2');

  maniver.version('1.0.9');
  maniver.maintenance();
  assert.equal(maniver.version(), '1.0.10');

  maniver.version('1.0.9');
  maniver.maintenance();
  maniver.maintenance();
  assert.equal(maniver.version(), '1.0.11');

  maniver.version('1.0.65535');
  maniver.maintenance();
  assert.equal(maniver.version(), '1.1.0');

  maniver.version('65535.65535.65535');
  maniver.maintenance();
  assert.equal(maniver.version(), '65535.65535.65535');
});

it('should returns valid updated minor version', function () {
  var maniver = new ManiVer();
  maniver.minor();
  assert.equal(maniver.version(), '0.1.0');

  maniver.minor();
  assert.equal(maniver.version(), '0.2.0');

  maniver.version('1.9');
  maniver.minor();
  assert.equal(maniver.version(), '1.10');

  maniver.version('1.9.9');
  maniver.minor();
  maniver.minor();
  assert.equal(maniver.version(), '1.11.9');

  maniver.version('1.65535');
  maniver.minor();
  assert.equal(maniver.version(), '2.0');

  maniver.version('65535.65535');
  maniver.minor();
  assert.equal(maniver.version(), '65535.65535');
});

it('should returns valid updated maintenance version', function () {
  var maniver = new ManiVer();
  maniver.major();
  assert.equal(maniver.version(), '1.0.0');

  maniver.major();
  assert.equal(maniver.version(), '2.0.0');

  maniver.version('1.0.9');
  maniver.major();
  assert.equal(maniver.version(), '2.0.9');

  maniver.version('1.0.9');
  maniver.major();
  maniver.major();
  assert.equal(maniver.version(), '3.0.9');

  maniver.version('65535.0.0');
  maniver.major();
  assert.equal(maniver.version(), '65535.0.0');

  maniver.version('65535.65535.65535');
  maniver.major();
  assert.equal(maniver.version(), '65535.65535.65535');
});

it('should returns valid updated version for manifest', function () {
  var manifest = JSON.parse(fs.readFileSync(path.relative(process.cwd(), 'fixture/manifest.json'), 'utf8'));
  var maniver = new ManiVer(manifest.version);

  manifest.version = maniver.major().version();
  assert.equal(manifest.version, '1.0.1');
});

it('should returns valid updated version with build scheme', function () {
  var maniver = new ManiVer();

  maniver.version('build');
  assert.equal(maniver.version(), '0.0.0.1');
  
  maniver.version('builder');
  assert.equal(maniver.version(), '0.0.0.1');

  maniver.version('maintenance');
  assert.equal(maniver.version(), '0.0.1.1');
  
  maniver.version('minor');
  assert.equal(maniver.version(), '0.1.1.1');
  
  maniver.version('major');
  assert.equal(maniver.version(), '1.1.1.1');
});

it('should returns valid updated version with static method', function () {
  assert.equal(ManiVer.version('0.0.1', 'build'), '0.0.1.1');
  assert.equal(ManiVer.version('0.0.1', 'maintenance'), '0.0.2');
  assert.equal(ManiVer.version('0.1.1', 'minor'), '0.2.1');
  assert.equal(ManiVer.version('0.0.1', 'major'), '1.0.1');
});

