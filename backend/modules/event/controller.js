const _ = require('lodash');
const Event = require('./model');
const { NotFoundError } = require('../../common/errors/errors');

const controller = {};

controller.getPublicEvents = () => {
    return Event.find({
        published: true
    });
};

controller.getPublicEventBySlug = slug => {
    return Event.findOne({
        published: true,
        slug
    });
};

controller.getPublicEventById = id => {
    return Event.findById(id).then(event => {
        if (!event.published) {
            throw new NotFoundError(`Event with slug ${event.slug} does not exist`);
        }
        return event;
    });
};

controller.getEventBySlug = slug => {
    return Event.findOne({ slug });
};

controller.getEventById = id => {
    return Event.findById(id);
};

controller.createEvent = (eventData, user) => {
    console.log('EVENT DATA', eventData);
    console.log('USER', user);
    const event = new Event({
        name: eventData.name,
        owner: user.sub
    });

    console.log('EVENT', event);

    return event.save();
};

controller.updateEvent = (event, eventData) => {
    return Event.updateAllowed(event, eventData);
};

controller.addOrganiser = (event, organiserId) => {
    event.organisers = _.concat(event.organisers, organiserId);
    return event.save();
};

controller.removeOrganiser = (event, organiserId) => {
    event.organisers = _.filter(event.organisers, id => id !== organiserId);
    return event.save();
};

controller.getEventsByOrganiser = user => {
    return Event.find().or([{ owner: user.sub }, { organisers: user.sub }]);
};

controller.deleteEventBySlug = slug => {
    return controller.getEventBySlug(slug).then(event => {
        if (!event) {
            throw new NotFoundError(`Event with slug ${slug} does not exist`);
        }
        return event.remove();
    });
};

controller.updateWinners = (eventId, winners) => {
    return Event.findById(eventId).then(event => {
        event.winners = winners;
        return event.save();
    });
};

module.exports = controller;
