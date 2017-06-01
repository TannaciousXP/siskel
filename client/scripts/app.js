/*
"add" (model, collection, options) — when a model is added to a collection.
"remove" (model, collection, options) — when a model is removed from a collection.
"update" (collection, options) — single event triggered after any number of models have been added or removed from a collection.
"reset" (collection, options) — when the collection's entire contents have been reset.
"sort" (collection, options) — when the collection has been re-sorted.
"change" (model, options) — when a model's attributes have changed.
"change:[attribute]" (model, value, options) — when a specific attribute has been updated.
"destroy" (model, collection, options) — when a model is destroyed.
"request" (model_or_collection, xhr, options) — when a model or collection has started a request to the server.
"sync" (model_or_collection, response, options) — when a model or collection has been successfully synced with the server.
"error" (model_or_collection, response, options) — when a model's or collection's request to the server has failed.
"invalid" (model, error, options) — when a model's validation fails on the client.
"route:[name]" (params) — Fired by the router when a specific route is matched.
"route" (route, params) — Fired by the router when any route has been matched.
"route" (router, route, params) — Fired by history when any route has been matched.
"all" — this special event fires for any triggered event, passing the event name as the first argument followed by all trigger arguments.

---------------------------------------------------------------------------

var Chapter  = Backbone.Model;
var chapters = new Backbone.Collection;

chapters.comparator = 'page';

chapters.add(new Chapter({page: 9, title: "The End"}));
chapters.add(new Chapter({page: 5, title: "The Middle"}));
chapters.add(new Chapter({page: 1, title: "The Beginning"}));

alert(chapters.pluck('title'));


*/

var Movie = Backbone.Model.extend({

  defaults: {
    like: true
  },

  toggleLike: function() {  

    // console.log(this.get('like'));
    var isLike = this.get('like');
    isLike = !isLike;
    this.set('like', isLike);
  }

});

var Movies = Backbone.Collection.extend({

  model: Movie,

  initialize: function() {
    // your code here
    this.on('change', function() {
      this.sortByField();
    });
  },

  comparator: 'title',

  sortByField: function(field) {
    // your code here
    this.comparator = field || this.comparator;
    this.sort();  
  }

});

var AppView = Backbone.View.extend({

  events: {
    'click form input': 'handleClick'
  },

  handleClick: function(e) {
    var field = $(e.target).val();
    this.collection.sortByField(field);
  },

  render: function() {
    new MoviesView({
      el: this.$('#movies'),
      collection: this.collection
    }).render();
  }

});

var MovieView = Backbone.View.extend({

  template: _.template('<div class="movie"> \
                          <div class="like"> \
                            <button><img src="images/<%- like ? \'up\' : \'down\' %>.jpg"></button> \
                          </div> \
                          <span class="title"><%- title %></span> \
                          <span class="year">(<%- year %>)</span> \
                          <div class="rating">Fan rating: <%- rating %> of 10</div> \
                        </div>'),

  initialize: function() {
    // your code here
    this.model.on('change', this.render, this);
  },

  events: {
    'click button': 'handleClick'
  },

  handleClick: function() {
    // your code here
    this.model.toggleLike();
  },

  render: function() {
    this.$el.html(this.template(this.model.attributes));
    return this.$el;
  }

});

var MoviesView = Backbone.View.extend({

  initialize: function() {
    // your code here
    this.collection.on('sort', this.render, this);
  },

  render: function() {
    this.$el.empty();
    this.collection.forEach(this.renderMovie, this);
  },

  renderMovie: function(movie) {
    var movieView = new MovieView({model: movie});
    this.$el.append(movieView.render());
  }

});
