'use strict';

function isValidVersion(ver) {
  var verarr = ver.indexOf('.') >= 0 ? ver.split('.') : [ver];

  if (verarr.length > 4 || verarr.length === 0) {
    return false;
  }

  return verarr.map(function(v) {
    if (/^[0]\d+/.test(v) || Number(v) > 99999) {
      return false;
    }

    return true;
  }).indexOf(false) === -1;
}

function version(ver, length) {
  // Check that build number overflow
  if (!ver[length]) {
    return null;
  }

  if (ver[length] + 1 <= 65535) {
    ver[length] = (Number(ver[length]) + 1).toString();
    return ver;
  } else {
    ver[length] = '0';
    return version(ver, --length);
  }
}

function fill(verarr, length) {
  var to = length - verarr.length;
  for (var i = 0; i < to; ++i) {
    verarr.push('0');
  }
  return verarr;
}

function up(verarr, length) {
  var copie = verarr.slice(0);

  if (copie.length < length) {
    copie = fill(copie, length);
  }

  // return updated version or origin value;
  return version(copie, length - 1) || verarr;
}

function Version(newver) {
  this.version(newver || '1.0.0');
}

Version.prototype.version = function (newver) {
  if (newver){
    if (isValidVersion(newver)) {
      this._version = newver.split('.');
    }
  }

  return this._version.join('.');
}

Version.prototype.build = function() {
  this._version = up(this._version, 4);
}

Version.prototype.maintenance = function() {
  this._version = up(this._version, 3);
}

Version.prototype.minor = function() {
  this._version = up(this._version, 2);
}

Version.prototype.major = function() {
  this._version = up(this._version, 1);
}

module.exports = Version;
