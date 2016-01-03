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
      list.append($('<li class="fc-event">' + plan.displayName + '<span class="removeEvent glyphicon glyphicon-trash pull-right" id="Delete"></span>'+ '</li>'));
    });
    $('#external-events').html(this.$el);
    $('.fc-event').each(function() {
      // store data so the calendar knows to render an event upon drop
      $(this).data('event', {
        title: $.trim($(this).text()), // use the element's text as the event title
        stick: true, // maintain when user navigates (see docs on the renderEvent method)
      });
      $(this).draggable({
        zIndex: 999,
        revert: true, // will cause the event to go back to its
        revertDuration: 0 //  original position after the drag
      });
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
  eventClick(calEvent, jsEvent, view) {
  if (jsEvent.target.id === 'Delete') {
    $("#myModal").modal(); // Maybe show a modal dialog asking the user if he wants to delete the event. 
  }
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
    console.log('dropped!');
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
      events: JSON.parse(localStorage.getItem('events')),
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
      }
    });
  }
  // trashEvents() {
  //   $('#trashBin').html({
  //     editable: true,
  //     droppable: true,
  //     eventDrop: this.handleDrop,
  //     eventReceive: this.handleDrop
  //   })
  // }
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
