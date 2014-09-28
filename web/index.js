(function() {
  // Setup global behaviours =============================
  $(document).keypress(function(e) {
    // forward-slash
    if (e.which === 47 || e.which === 191) {
      e.preventDefault();
      $("#search-form input[name='term']").select();
    }
  });

  // Init Lunr index =============================
  var lunrIndex = lunr(function() {
    this.field("id", {boost: 10});
    this.ref("id");
  });

  // Define models =============================
  var Filter = Backbone.Model.extend({
    defaults: {
      searchTerm: ""
    },
    initialize: function initialize(opts) {
      var self = this;

      // source
      self.collection = opts.collection;

      // index
      _.each(self.collection.models, function(model) {
        var modelJson = model.toJSON();
        var keywords = modelJson.keywords;
        var keywordsArr = model.get("keywords").replace(/\s+/g, "").split(",");

        // otherwise lunr cannot index them properly (yea not even CSV)
        _.each(keywordsArr, function(keyword, i) {
          var fieldName = "__keyword_" + i;

          modelJson[fieldName] = keyword;
          // add to the index fields on-the-fly
          lunrIndex.field(fieldName);
        });

        lunrIndex.add(modelJson);

        // also, generate an array for easier display
        model.set("__keywords", keywordsArr);
      });

      // dynamically filtered from the source
      self.filtered = new Backbone.Collection(opts.collection.models);

      // trigger search some time after user stops typing
      var timeoutId;

      self.on("change searchTerm", function() {
        if (timeoutId) {
          clearTimeout(timeoutId);
        }

        timeoutId = setTimeout(function() {
          self.filter();
        }, 200); // this is a reasonable amount of delay
      });
    },
    filter: function filter() {
      var searchTerm = this.get("searchTerm");
      var models = this.collection.models;

      if (searchTerm) {
        var results = lunrIndex.search(searchTerm);
        var resultsMap = results.reduce(function(map, result) {
            map[result.ref] = true;
            return map;
        }, {});

        models = this.collection.filter(function(model) {
          return resultsMap[model.get("id")];
        });
      }

      this.filtered.reset(models);
    }
  });

  // Define views =============================
  var BaseView = Backbone.View.extend({
    // allow in-place DOM changes
    render: function render() {
      var oldEl = this.$el;
      var html = this.html();
      var newEl = $("<div>").html(html);

      this.setElement(newEl);
      oldEl.replaceWith(newEl);

      return this;
    }
  });

  var ListView = BaseView.extend({
    initialize: function initialize(opts) {
      // store the compile function
      this.template = opts.template;
      // re-render when a bound (filtered) collection is reset
      this.listenTo(this.collection, "reset", this.render);
    },
    html: function html() {
      return this.template({
        models: this.collection.toJSON()
      })
    }
  });

  var FormView = Backbone.View.extend({
    events: {
      "keyup input[name='term']": function(e) {
        this.model.set("searchTerm", e.currentTarget.value);
      }
    }
  });

  // Init data and collection =============================
  YAML.load("icons.yaml", function(iconData) {

    var icons = new Backbone.Collection(iconData);
    var iconsFilter = new Filter({
      collection: icons
    });

    // Init views =============================
    var formView = new FormView({
      el: "#search-form",
      model: iconsFilter
    });
    var listView = new ListView({
      template: _.template($("#icon-list-template").html()),
      collection: iconsFilter.filtered
    });

    $("#icon-list").empty().append(listView.render().el);

  });

})();