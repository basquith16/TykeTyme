"use strict";
_.templateSettings = {
  interpolate: /\{\{(.+?)\}\}/g
};

class PlansView extends Backbone.View {
  get template() {
    return $('#plansTemplate').text();
  }
  initialize() {
    this.render();
    this.listenTo(this.model, 'change', this.render);
  }
  render() {
    this.$el.html(this.template);
    var list = $('#dragList', this.$el);
    _.each(this.model.get('plans'), function(plan) {
      list.append($('<li class="fc-event">' + plan.displayName + '  ' + '<span class="planCat">' + plan.category + '</span>' + '</li>'));
    });
    $('#external-events').html(this.$el);
    $('.fc-event').each(function() {
      // store data so the calendar knows to render an event upon drop
      $(this).data('event', {
        title: $(this).text(), // use the element's text as the event title
        stick: true, // maintain when user navigates (see docs on the renderEvent method)
      });
      $(this).draggable({
        zIndex: 999,
        revert: true, // will cause the event to go back to its
        revertDuration: 0 //  original position after the drag
      });
      var draggable = document.getElementById('dragList');
      dragList.addEventListener('touchmove', function(event) {
        var touch = event.targetTouches[0];

        draggable.style.left = touch.pageX-25 + 'px';
        draggable.style.top = touch.pageY-25 + 'px';
        event.preventDefault();
      }, false);
    });
    $('form').submit((e) => {
      e.preventDefault();
      var answer = $('input').val();
      if (answer !== '') {
        this.model.push('plans', new Activity({
          title: answer
        }));
      }
      $('input').val('');
      return false;
    });
  }
}
class CalendarView extends Backbone.View {
  get template() {
    return $('#calendarTemplate').text();
  }
  initialize() {
    this.listenTo(this.model, 'change', this.render);
    this.render();

  }
  handleDrop(event) {
    var events = $('#calendar').fullCalendar('clientEvents').map((event) => {
      return {
        title: event.title,
        start: event.start.format("L"),
        allDay: true
      }
    });
    localStorage.setItem('events', JSON.stringify(events));
  }

  render() {
    this.$el.html(this.template);
    $('#main').html(this.$el);
    $('#calendar', this.$el).fullCalendar({
      // googleCalendarApiKey: 'AIzaSyDJ9biHjohyZfDwcaWfHkemFLRnXKd1wW4',
      events: JSON.parse(localStorage.getItem('events')),
      // url: "https://www.google.com/calendar/feeds/basquithcpt%40gmail.com/public/basic",
      header: {
        left: 'prev,next today',
        center: 'title',
        right: 'month,agendaWeek,agendaDay'
      },
      editable: true,
      droppable: true, // this allows things to be dropped onto the calendar
      eventDrop: this.handleDrop,
      eventReceive: this.handleDrop,
      drop: function(date, jsEvent, ui) {
        // is the "remove after drop" checkbox checked?
        if ($('#drop-remove').is(':checked')) {
          $(this).remove();
        }
      },
      eventClick: function(event) {
        // opens events in a popup window
        var category = (event.title).split('').slice(-1).join('');

        if (category == "3") {
          var windowURL = 'http://basquith16.github.io/TykeTyme/#/meals'
        } else if (category == "1") {
          var windowURL = 'http://basquith16.github.io/TykeTyme/#/crafts'
        } else if (category == "2") {
          var windowURL = 'http://basquith16.github.io/TykeTyme/#/activities'
        }

        if (event.title == "The Sticky Foot Runway  2") {
          var t = 950;
        } else if (event.title == "Single-Leg Balances") {
          var t = 1800;
        }
        var w = window.open(windowURL, event, 'width=400,height=600');
        setTimeout(function() {
          w.scrollTo(0, t)
        }, 500);
        return false;
      },

      eventRender: function(event, element) {
        element.find(".eventButton").click(function() {
          $('#calendar').fullCalendar('removeEvents', event._id);
        });
      }

      // loading: function(bool) {
      //   $('#loading').toggle(bool);
      // }
    });

  }
}

class CraftView extends Backbone.View {
  get template() {
    return _.template($('#craftTemplate').text());
  }
  initialize(options) {
    this.schedule = options.schedule;
  }
  events() {
    return {
      'click #addItem': 'onButtonNewClick'
    }
  }
  onButtonNewClick() {
    this.schedule.set('plans',
      this.schedule.get('plans').concat(this.model)
    );
  }
  render() {
    this.$el.html(this.template(this.model.attributes));
    return this.$el;
  }
}
class ActivityView extends Backbone.View {
  get template() {
    return _.template($('#activityTemplate').text());
  }
  initialize(options) {
    this.schedule = options.schedule;
  }
  events() {
    return {
      'click #addItem': 'onButtonNewClick'
    }
  }
  onButtonNewClick() {
    this.schedule.set('plans',
      this.schedule.get('plans').concat(this.model)
    );
  }
  render() {
    this.$el.html(this.template(this.model.attributes));
    return this.$el;
  }
}
class MealView extends Backbone.View {
  get template() {
    return _.template($('#mealTemplate').text());
  }
  initialize(options) {
    this.schedule = options.schedule;
  }

  events() {
    return {
      'click #addItem': 'onButtonNewClick'
    }
  }
  onButtonNewClick() {
    this.schedule.push('plans', this.model);
  }
  render() {
    this.$el
      .html(this.template(this.model.attributes));
    return this.$el;
  }
}
class CraftsView extends Backbone.View {
  initialize(options) {
    this.schedule = options.schedule
  }
  render() {
    const self = this;
    this.collection
      .each((craft) => {
        let view = new CraftView({
          model: craft,
          schedule: this.schedule
        });
        self.$el
          .append(view.render());
      });
    return this.$el;
  }
};
class ActivitiesView extends Backbone.View {
  initialize(options) {
    this.schedule = options.schedule
  }
  render() {
    const self = this;
    this.collection
      .each((activity) => {
        let view = new ActivityView({
          model: activity,
          schedule: this.schedule
        });
        self.$el
          .append(view.render());
      });
    return this.$el;
  }
};
class MealsView extends Backbone.View {
  initialize(options) {
    this.schedule = options.schedule
  }
  render() {
    const self = this;
    this.collection
      .each((meal) => {
        let view = new MealView({
          model: meal,
          schedule: this.schedule
        });
        self.$el
          .append(view.render());
      });
    return this.$el;
  }
};
class ContactView extends Backbone.View {
  get template() {
    return $('#contactTemplate').text();
  }
  initialize() {
    this.render();
  }
  render() {
    this.$el.html(this.template);
    $('#main').html(this.$el);
  }
};
