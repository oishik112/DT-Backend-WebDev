const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

app.use(bodyParser.json());
app.use(cors());

// Sample events data
let events = [
  {
    uid: 1,
    name: 'Event 1',
    tagline: 'Tagline 1',
    schedule: '2023-05-01T14:30:00.000Z',
    description: 'Description 1',
    files: {
      image: 'image1.jpg'
    },
    moderator: 'John Doe',
    category: 'Category 1',
    sub_category: 'Subcategory 1',
    rigor_rank: 5,
    attendees: [1, 2, 3]
  },
  {
    uid: 2,
    name: 'Event 2',
    tagline: 'Tagline 2',
    schedule: '2023-05-02T14:30:00.000Z',
    description: 'Description 2',
    files: {
      image: 'image2.jpg'
    },
    moderator: 'Jane Doe',
    category: 'Category 2',
    sub_category: 'Subcategory 2',
    rigor_rank: 3,
    attendees: [4, 5, 6]
  }
];

// GET /api/v3/app/events?id=:event_id
app.get('/api/v3/app/events', (req, res) => {
  const eventId = parseInt(req.query.id);
  const event = events.find((e) => e.uid === eventId);
  if (event) {
    res.status(200).json(event);
  } else {
    res.status(404).json({ message: 'Event not found' });
  }
});

// GET /api/v3/app/events?type=latest&limit=5&page=1
app.get('/api/v3/app/events', (req, res) => {
  const limit = parseInt(req.query.limit);
  const page = parseInt(req.query.page);
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const latestEvents = events
    .sort((a, b) => new Date(b.schedule) - new Date(a.schedule))
    .slice(startIndex, endIndex);
  res.status(200).json(latestEvents);
});

// POST /api/v3/app/events
app.post('/api/v3/app/events', (req, res) => {
  const event = req.body;
  const newEvent = {
    uid: events.length + 1,
    name: event.name,
    tagline: event.tagline,
    schedule: event.schedule,
    description: event.description,
    files: {
      image: event.files.image
    },
    moderator: event.moderator,
    category: event.category,
    sub_category: event.sub_category,
    rigor_rank: event.rigor_rank,
    attendees: []
  };
  events.push(newEvent);
  res.status(201).json({ uid: newEvent.uid });
});

// PUT /api/v3/app/events/:id
app.put('/api/v3/app/events/:id', (req, res) => {
  const eventId = parseInt(req.params.id);
  const event = events.find((e) => e.uid === eventId);
  if (event) {
    const updatedEvent = req.body;
    event.name = updatedEvent.name;
    event.tagline = updatedEvent.tagline;
    event.schedule = updatedEvent.schedule;
    event.description = updatedEvent.description;
    event.files = {
      image: updatedEvent.files.image
    };
    event.moderator = updatedEvent.moderator;
    event.category = updatedEvent.category;
    event.sub_category = updatedEvent.sub_category;
    event.rigor_rank = updatedEvent.rigor_rank;
    res.status(200).json({ message: 'Event updated' });
  } else {
    res.status(404).json({ message: 'Event not found' });
  }
});

// DELETE /api/v3/app/events/:id
app.delete('/api/v3/app/events/:id', (req, res) => {
  const eventId = parseInt(req.params.id);
  events = events.filter((e) => e.uid !== eventId);
  res.status(200).json({ message: 'Event deleted' });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});