var fs = require('fs');
var xdiff = require('xdiff');
var detectIndent = require('detect-indent');
var logger = require("./log.js").logger;

var encoding = 'utf-8';

function mergeJsonFiles(oursFileName, baseFileName, theirsFileName, mergedFileName) {
	logger.debug(["mergeJsonFiles.1", oursFileName, baseFileName, theirsFileName, mergedFileName, encoding]);

	var oursJson = fs.readFileSync(oursFileName, encoding);
	var baseJson = fs.readFileSync(baseFileName, encoding);
	var theirsJson = fs.readFileSync(theirsFileName, encoding);
	var newOursJson = mergeJson(oursJson, baseJson, theirsJson);

	// logger.debug(["mergeJsonFiles.2", oursJson, baseJson, theirsJson, newOursJson]);

	fs.writeFileSync(mergedFileName, newOursJson, encoding);
}

function mergeJson(oursJson, baseJson, theirsJson) {
	var oursIndent = detectIndent(oursJson).indent;
	var baseIndent = detectIndent(baseJson).indent;
	var theirsIndent = detectIndent(theirsJson).indent;
	var newOursIndent = selectIndent(oursIndent, baseIndent, theirsIndent);

	// logger.debug(["mergeJson.1", oursIndent, baseIndent, theirsIndent, newOursIndent]);

	var ours = JSON.parse(oursJson);

	// logger.debug([ours]);

	var base = JSON.parse(baseJson);

	// logger.debug([base]);

	var theirs = JSON.parse(theirsJson);

	// logger.debug([theirs]);

	var newOurs = merge(ours, base, theirs);

	// logger.debug([newOurs]);

	var newOursJson = JSON.stringify(newOurs, null, newOursIndent);

	// logger.debug(["mergeJson.6", newOursJson]);

	return newOursJson;
}

function merge(ours, base, theirs) {
	var diff = xdiff.diff3(ours, base, theirs);

	if (diff) {
		return xdiff.patch(base, diff);
	}

	return base;
}

function selectIndent(oursIndent, baseIndent, theirsIndent) {
	return oursIndent !== baseIndent ? oursIndent : theirsIndent !== baseIndent ? theirsIndent : baseIndent;
}

module.exports = {
	mergeJsonFiles: mergeJsonFiles,
	mergeJson: mergeJson,
	merge: merge,
	selectIndent: selectIndent
}
