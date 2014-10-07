var YAML = require("yamljs");
var Q = require("q");
var fs = require("fs");
var https = require("https");
var http = require("http");

module.exports = function(grunt) {

  grunt.initConfig({
    "exec": {
      "gh-pages": {
        command: "git subtree push --prefix web origin gh-pages"
      }
    },
    "booticons": {
      main: {
        resources: {
          glyphicons: "https://raw.githubusercontent.com/twbs/bootstrap/master/docs/_data/glyphicons.yml",
          fontawesome: "https://raw.githubusercontent.com/FortAwesome/Font-Awesome/master/src/icons.yml"
        },
        destFile: "web/icons.yaml",
        // ==================================
        // http://thesaurus.altervista.org
        // NOTE: please request your own key and replace it here
        // ==================================
        thesaurusKey: "your_key"
      }
    }
  });

  // TODO: modularize the processes
  grunt.registerMultiTask("booticons", "Download, format and aggregate icon data", function() {
    var done = this.async();
    var config = this.data;
    var resources = config.resources;
    var destFile = config.destFile;
    var thesaurusKey = config.thesaurusKey;

    var promises = [];

    var existingIconsMap = {};

    if (fs.existsSync(destFile)) {
      grunt.log.writeln("Found existing icons data");

      var existingIconsDeferred = Q.defer();

      // include this as pre-requisites as well
      promises.push(existingIconsDeferred.promise);
      
      fs.readFile(destFile, {encoding: "utf8"}, function(error, content) {
        if (error) {
          // stop everything
          return existingIconsDeferred.reject(error);
        }

        // start mapping
        var existingIcons = YAML.parse(content);

        console.log("Found existing icons count: " + existingIcons.length);

        existingIconsMap = existingIcons.reduce(function(map, icon) {
          map[icon.id] = icon;

          // ease the process later
          icon.keywordsMap = icon.keywords.split(",").reduce(function(map, keyword) {
            map[keyword] = true;
            return map;
          }, {});

          return map;
        }, existingIconsMap);

        existingIconsDeferred.resolve(existingIconsMap);
      });
    }

    Object.keys(resources).forEach(function(iconSet) {
      var url = resources[iconSet];
      var deferred = Q.defer();

      grunt.log.writeln("Requesting icon set: " + iconSet);

      https.get(url, function success(response) {
        var responseText = "";

        // http://stackoverflow.com/a/20173218/940030
        response.setEncoding("utf8");

        // http://stackoverflow.com/a/21953201/940030
        response.on("data", function(chunk) {
          responseText += chunk;
        });
        response.on("end", function() {
          deferred.resolve({
            iconSet: iconSet, 
            yaml: responseText
          });
        });

      }).on("error", function error(reason) {
        deferred.reject(reason.message);
      });

      promises.push(deferred.promise);
    });

    Q.all(promises).then(
      function success(results) {
        grunt.log.writeln("Parsing YAML contents");

        // this is a workaround to map iconSet to its YAML content
        // because Q itself doesn't support Q.all(map)
        var yamlContents = results.reduce(function(map, result) {
          map[result.iconSet] = result.yaml;
          return map;
        }, {});

        var glyphicons = YAML.parse(yamlContents.glyphicons);
        var fontawesome = YAML.parse(yamlContents.fontawesome);

        // use a map so that we don't make unnecessary calls
        var nouns = {};

        var formattedGlyphicons = glyphicons.map(function(iconId) {
          // it's always the 2nd
          var noun = iconId.split("-")[1];

          // for later use
          nouns[noun] = true;

          return {
            id: iconId,
            source: "glyphicons",
            clazz: "glyphicon " + iconId,
            keywords: "",
            noun: noun
          };
        });
        var formattedFontawesome = fontawesome.icons.map(function(icon) {
          // it's always the 1st
          var noun = icon.id.split("-")[0];

          // for later use
          nouns[noun] = true;

          // standardize it for easier differentiation with glyphicons
          icon.id = "fa-" + icon.id;
          icon.source = "fontawesome";
          icon.clazz = "fa " + icon.id;
          icon.keywords = "";
          icon.noun = noun;

          return icon;
        });
        // merge
        var icons = formattedGlyphicons.concat(formattedFontawesome);

        // request for synonyms
        var synonymPromises = [];
        var synonyms = {};
        var synonymRequests = [];

        grunt.log.writeln("Requesting synonyms");

        Object.keys(nouns).forEach(function(noun) {
          var deferred = Q.defer();

          synonymRequests.push({
            deferred: deferred,
            noun: noun
          });
          synonymPromises.push(deferred.promise);
        });

        // simulate a human request (in order to not get banned by the service)
        // I'm not too over either - these requests shall be done just once
        // so, use a recursive function
        var requestSynonym = function requestSynonym(i) {
          var request = synonymRequests[i];
          var url = "http://thesaurus.altervista.org/thesaurus/v1?" +
                    "key=" + thesaurusKey + "&" + 
                    "language=en_US&" + 
                    "output=json&" + 
                    "word=" + request.noun;

          http.get(url, function success(response) {
            var responseText = "";

            // http://stackoverflow.com/a/20173218/940030
            response.setEncoding("utf8");

            // http://stackoverflow.com/a/21953201/940030
            response.on("data", function(chunk) {
              responseText += chunk;
            });
            response.on("end", function() {
              var result = "";
              var rawResult;

              try {
                rawResult = JSON.parse(responseText);
              } catch (ex) {
                grunt.log.error("Error in parsing synonym result of " + request.noun + ": " + ex);
              }

              // look for noun-type synonyms
              // response schema: refer http://thesaurus.altervista.org/service
              if (rawResult && rawResult.response) {
                rawResult.response.some(function(item) {
                  if (item.list.category == "(noun)") {
                    var synonymList = item.list.synonyms.split("|");

                    // filter out antonyms (its occurence is shown in the example)
                    for (var i = synonymList.length - 1; i >= 0; i--) {
                      if (synonymList[i].indexOf("(antonym)") != -1) {
                        synonymList.splice(i, 1);
                      }
                    }

                    // we'll convert to CSV later
                    synonyms[request.noun] = result = synonymList;

                    return true;
                  }
                });
              }

              grunt.log.writeln("Synonyms of noun " + request.noun + ": " + result);

              // in case we want it? not used for now
              request.deferred.resolve(result);

              // queue for next (wait for 2 secs)
              setTimeout(function() {
                requestSynonym(++i);
              }, 2000);
            });

          }).on("error", function error(reason) {
            request.deferred.reject(reason.message);
          });
        };

        // start
        requestSynonym(0);

        return Q.all(synonymPromises).then(function() {
          // we wanna chain with icons (with synonyms)
          icons.forEach(function(icon) {
            var keywordList = synonyms[icon.noun] || [];
            var existingIcon = existingIconsMap[icon.id];

            if (existingIcon) {
              // aggregate
              Object.keys(existingIcon.keywordsMap).forEach(function(keyword) {
                if (keywordList.indexOf(keyword) == -1) {
                  keywordList.push(keyword);
                }
              });
            }

            // turn into CSV
            icon.keywords = keywordList.join(",");

            grunt.log.writeln("Aggregated synonyms of noun " + icon.noun + ": " + icon.keywords);
          });

          return icons;
        });
        
    }).then(
      function success(icons) {
        grunt.log.writeln("Found " + icons.length + " icons. Writing result to " + destFile);

        // overwrite any
        fs.writeFile(destFile, YAML.stringify(icons, 2, 2), function(error) {
          if (error) {
            grunt.log.error(error);
            // fail the task
            return done(false);
          }

          grunt.log.writeln("Generated icon data successfully");

          done();
        });
      },
      function error(reason) {
        grunt.log.error(reason);
        // fail the task
        return done(false);
      }
    );

  });

  grunt.loadNpmTasks("grunt-exec");

  grunt.registerTask("default", ["booticons"]);
  grunt.registerTask("publish", ["exec:gh-pages"]);

};