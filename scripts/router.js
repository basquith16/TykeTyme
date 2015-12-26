"use strict";

class Router extends Backbone.Router {
  get routes() {
    return {
      "": 'index',
      'crafts': 'showCrafts',
      'activities': 'showActivities',
      'whatsAround': 'showMap',
      'meals': 'showMeals',
      'contact': 'contactUs'
    };
  }
  index() {
    const calendarView = new CalendarView();
  }
  showCrafts() {
    this.crafts = new Crafts();
    const craftsView = new CraftsView({
      schedule: this.schedule,
      collection: this.crafts
    });
    this.crafts.fetch().done(() => {
      $('#main').html(craftsView.render());
    }).fail((xhr, status, error) => {
      console.log(xhr, status, error);
    })
  }
  showActivities() {
    this.activities = new Activities();
    const activitiesView = new ActivitiesView({
      schedule: this.schedule,
      collection: this.activities
    });
    this.activities.fetch().done(() => {
      $('#main').html(activitiesView.render());
    }).fail((xhr, status, error) => {
      console.log(xhr, status, error);
    })
  }
  showMeals() {
    this.meals = new Meals();
    const mealsView = new MealsView({
      schedule: this.schedule,
      collection: this.meals
    });
    this.meals.fetch().done(() => {
      $('#main').html(mealsView.render());
    }).fail((xhr, status, error) => {
      console.log(xhr, status, error);
    })
  }
  showMap() {
    $.ajax('map.html').then(function(page) {
      $('#main').html(page);
    })
  }
  contactUs() {
    this.contact = new Contact();
    const contactView = new ContactView({
      schedule: this.schedule,
    });
    this.contact.fetch().done(() => {
      $('#main').html(contactView.render());
    }).fail((xhr, status, error) => {
      console.log(xhr, status, error);
    })
  }
  initialize() {
    this.crafts = new Crafts();
    this.activities = new Activities();
    this.meals = new Meals();
    this.schedule = new Schedule();
    this.calendar = new Calendar();
    this.contact = new Contact();
    this.plansView = new PlansView({
      model: this.schedule
    });
    var plans = JSON.parse(localStorage.getItem('plans'));
    if (plans !== null) {
      _.each(plans, (plan) => {
        this.schedule.push('plans', new Activity({title: plan}));
      })
    }
    window.schedule = this.schedule;
    Backbone.history.start();
  }
};
$(function() {
  var router = new Router();
});
