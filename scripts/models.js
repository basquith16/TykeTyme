"use strict";

_.templateSettings = {
  interpolate: /\{\{(.+?)\}\}/g
};
class Calendar extends Backbone.Model {};
class Contact extends Backbone.Model {};
class Schedule extends Backbone.Model {
  initialize() {
    this.bind('change', this.persist);
  }
  persist() {
    var plans = this.get('plans').map((plan) => { return plan.get('title') });
    localStorage.setItem('plans', JSON.stringify(plans));
  }
  get defaults() {
    return {
      plans: []
    }
  }
  push(arg, val) {
    var arr = _.clone(this.get(arg));
    arr.push(val);
    this.set(arg, arr);
  }
}
class Craft extends Backbone.Model {
  get displayName() {
    return this.get('title');
  }
}
class Activity extends Backbone.Model {
  get displayName() {
    return this.get('title');
  }
}
class Meal extends Backbone.Model {
  get displayName() {
    return this.get('title');
  }
}
class Crafts extends Backbone.Collection {
  get url() {
    return 'crafts.jsonl'
  }
  get model() {
    return Craft
  }
}
class Activities extends Backbone.Collection {
  get url() {
    return '../PhysActivities.JSON'
  }
  get model() {
    return Activity
  }
}
class Meals extends Backbone.Collection {
  get url() {
    return '../meals.JSON'
  }
  get model() {
    return Meal
  }
}
