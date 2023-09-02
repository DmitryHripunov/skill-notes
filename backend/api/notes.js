import express from 'express';
import auth from '../middleware/auth.js';
import knex from '../knex.js';

const notes = express.Router();

notes.get(('/api/notes/'), auth, async (req, res) => {
  if (!req.user) {
    return res.redirect('/');
  }

  try {
    const userId = await req.user.id;
    const { age, search, page } = req.headers;
    let hasMore = true;
    const date = new Date();
    const currentMonth = date.getMonth();
    const limit = 10;

    let notes = await knex('notes').select({
      id: 'id',
      title: 'title',
      text: 'text',
      created: 'created_at',
      archive: 'is_archive'
    })
    .where({ user_id: userId })
    .where((userNotes) => {
      switch(age) {
        case 'archive':
          userNotes.where('is_archive', true);
          break;
        case '1month':
          userNotes.whereRaw('extract(month from created_at) = ?', [currentMonth + 1]);
          break;
        case '3months':
          userNotes.whereRaw('created_at >= ?', [new Date(new Date().setMonth(currentMonth - 3))]);
          break;
        default:
          userNotes;
      }

      if (search) {
        userNotes.where('title', 'ilike', `%${search}%`); // ilike для регистронезависимого поиска
      }

      if (userNotes.length < page) hasMore = false;

      return userNotes;
    })
    .limit(limit)
    .offset((page - 1) * limit)

    return res.json({ data: notes, hasMore });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

notes.get(('/api/notes/:id/'), auth, async (req, res) => {
  if (!req.user) {
    return res.redirect('/');
  }

  try {
    const noteId = req.params.id;
    const data = await knex('notes')
      .select('title', 'text', 'id', { isArchived: 'is_archive' })
      .where({ id: noteId })
      .limit(1)
      .then((results) => results[0])
      .catch((error) => { res.send(error) });

    return res.json(data);
  } catch (error) {
    res.statusCode(500).send(error.message)
    console.log(error.message)
    res.end();
  }
});

notes.post(('/api/notes/'), auth, async (req, res) => {
  if (!req.user) {
    return res.redirect('/');
  }

  try {
    await knex('notes').insert({
      title: req.body.title,
      text: req.body.text,
      user_id: req.user.id,
    })
      .catch((error) => { res.send(error) });

    const findingNewNote = await knex('notes')
      .select('id')
      .where({
        title: req.body.title,
        text: req.body.text,
      })
      .limit(1)
      .then((results) => results[0])
      .catch((error) => { res.send(error) });

    return res.json(findingNewNote);
  } catch (error) {
    res.send(error.message)
    console.log(error.message)
    res.end();
  }
});

notes.put(('/api/notes/:id/'), auth, async (req, res) => {
  if (!req.user) {
    return res.redirect('/');
  }

  try {
    const noteId = req.params.id;
    const data = await knex('notes')
      .select('title', 'text')
      .where({ id: noteId })
      .update({
        title: req.body.title,
        text: req.body.text,
      })
      .catch((error) => { res.send(error) });

    return res.json({ data });
  } catch (error) {
    res.status(304);
    console.log(error);
  }
});

notes.put(('/api/notes/:id/archive'), auth, async (req, res) => {
  if (!req.user) {
    return res.redirect('/');
  }

  try {
    const noteId = req.params.id;
    const data = await knex('notes')
      .select('is_archive')
      .where({ id: noteId })
      .update({
        is_archive: true
      })
      .catch((error) => { res.send(error) });

    return res.json({ data });
  } catch (error) {
    res.status(304);
    console.log(error);
  }
});

notes.put(('/api/notes/:id/unarchive'), auth, async (req, res) => {
  if (!req.user) {
    return res.redirect('/');
  }

  try {
    const noteId = req.params.id;
    const data = await knex('notes')
      .select('is_archive')
      .where({ id: noteId })
      .update({
        is_archive: false
      })
      .catch((error) => { res.send(error) });

    return res.json({ data });
  } catch (error) {
    res.status(304);
    console.log(error);
  }
});

notes.delete(('/api/notes/:id/'), auth, async (req, res) => {
  if (!req.user) {
    return res.redirect('/');
  }

  try {
    const noteId = req.params.id;
    const data = await knex('notes')
      .where({ id: noteId })
      .del()
      .catch((error) => { res.send(error) });

    return res.json({ data });
  } catch (error) {
    res.status(304);
    console.log(error);
  }
});

notes.delete(('/api/notes/delete/all-archived'), auth, async (req, res) => {
  if (!req.user) {
    return res.redirect('/');
  }

  try {
    const data = await knex('notes')
      .where({ is_archive: true })
      .del()
      .catch((error) => { res.send(error) });

    return res.json({ data });
  } catch (error) {
    res.status(304);
    console.log(error);
  }
})

notes.get('api/notes/:id/downloadPDF', auth, async (req, res) => {
  if (!req.user) {
    return res.redirect('/');
  }
});

export default notes;
