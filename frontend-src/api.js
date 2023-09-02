const PREFIX = "http://lvh.me:3000/api";

const req = async (url, options = {}) => {
  const { body } = options;

  return fetch((PREFIX + url).replace(/\/\/$/, ""), {
    ...options,
    body: body ? JSON.stringify(body) : null,
    headers: {
      ...options.headers,
      ...(body
        ? {
            "Content-Type": "application/json",
          }
        : null),
    },
  }).then((res) =>
    res.ok
      ? res.json()
      : res.text().then((message) => {
          throw new Error(message);
        })
  );
};

export const getNotes = ({ age, search, page } = {}) => {
  return req('/notes/', {
    headers: { age, search, page }
   });
};

export const createNote = async (title, text) => {
   const note = await req('/notes/', {
    method: "post",
    body: { title, text }
  });

  return note;
};

export const getNote = (id) => {
  return req(`/notes/${id}`);
};

export const archiveNote = (id) => {
  return req(`/notes/${id}/archive/`, {
    method: "put",
  });
};

export const unarchiveNote = (id) => {
  return req(`/notes/${id}/unarchive`, {
    method: "put",
  });
};

export const editNote = (id, title, text) => {
  return req(`/notes/${id}`, {
    method: "put",
    body: { title, text }
  });
};

export const deleteNote = (id) => {
  return req(`/notes/${id}`, {
    method: "delete",
  });
};

export const deleteAllArchived = () => {
  return req(`/notes/delete/all-archived`, {
    method: "delete",
  });
};

export const notePdfUrl = (id) => {
  // return req(`/notes/${id}/downloadPDF/`)
  return `${PREFIX}/notes/${id}/downloadPDF`
};
