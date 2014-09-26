(function() {
  var Icon = Backbone.Model.extend({

    initialize: function initialize() {
      this.bind("error", function(model, error) {
        console.error(error);
      });
    },

    validate: function validate(attrs) {
      if (!attrs.id) {
        return "Icon ID is missing";
      }
    }

  });

  var Gallery = Backbone.Collection.extend({
    model: Icon
  });

  var glyphicons = YAML.load("bower_components/glyphicons/index.yml");
  var fontawesome = YAML.load("bower_components/icons/index.yml");

  var glyphiconModels = glyphicons.map(function(iconId) {
    return new Icon({
      id: iconId
    });
  });
  var fontawesomeModels = fontawesome.icons.map(function(icon) {
    return new Icon(icon);
  });

  var gallery = new Gallery(glyphiconModels.concat(fontawesomeModels));

  console.log(gallery.length);

})();