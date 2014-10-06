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

  grunt.registerMultiTask("booticons", "Download, format and aggregate icon data", function() {
    var done = this.async();
    var config = this.data;
    var resources = config.resources;
    var destFile = config.destFile;
    var thesaurusKey = config.thesaurusKey;

    // TODO: upgrade icons (check addition/removal and merge) gracefully
    if (fs.existsSync(destFile)) {
      grunt.log.error("Icons data has been generated. Please update the content in ./" + destFile);
      // fail the task
      return done(false);
    }

    var promises = [];

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
          // it's always the 2nd
          var noun = icon.id.split("-")[1];

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

                    // we want CSV
                    synonyms[request.noun] = result = synonymList.join(",");

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
            icon.keywords = synonyms[icon.noun] || icon.keywords;
          });

          return icons;
        });
        
    }).then(
      function success(icons) {
        grunt.log.writeln("Found " + icons.length + " icons. Writing result to " + destFile);

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