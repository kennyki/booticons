var YAML = require("yamljs");
var Q = require("q");
var fs = require("fs");
var https = require("https");

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
        destFile: "web/icons.yaml"
      }
    }
  });

  grunt.registerMultiTask("booticons", "Download, format and aggregate icon data", function() {
    var done = this.async();
    var config = this.data;
    var resources = config.resources;
    var destFile = config.destFile;

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

        var formattedGlyphicons = glyphicons.map(function(iconId) {
          return {
            id: iconId,
            source: "glyphicons",
            clazz: "glyphicon " + iconId,
            keywords: ""
          };
        });
        var formattedFontawesome = fontawesome.icons.map(function(icon) {
          // standardize it for easier differentiation with glyphicons
          icon.id = "fa-" + icon.id;
          icon.source = "fontawesome";
          icon.clazz = "fa " + icon.id;
          icon.keywords = "";
          return icon;
        });
        // merge
        var icons = formattedGlyphicons.concat(formattedFontawesome);

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