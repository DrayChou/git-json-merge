#!/usr/bin/env node

var x = require('xdiff')
var logger = require("./../lib/log").logger;
var gitJsonMerge = require('./../lib/git-json-merge.js');

logger.debug(process.argv);

var oursFileName = process.argv[2];
var baseFileName = process.argv[3];
var theirsFileName = process.argv[4];

// gitJsonMerge.mergeJsonFiles(oursFileName, baseFileName, theirsFileName);