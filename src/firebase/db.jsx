import { db } from './firebase';

// User API

export const doCreateUser = (id, username, email) =>
  db.ref(`users/${id}`).set({
    username,
    email,
  });

export const onceGetUsers = () => db.ref('users').once('value');

export const writeTableToDatabase = (
  userId,
  workId,
  name,
  type,
  rows,
  columns,
  textInTable,
  caption,
  label,
) =>
  db.ref(`work/${userId}/${workId}`).set({
    name,
    type,
    rows,
    columns,
    textInTable: JSON.stringify(textInTable),
    caption,
    label,
  });

export const writeMathToDatabase = (
  userId,
  workId,
  name,
  type,
  lines,
  linesText,
  annotationObject,
) =>
  db.ref(`work/${userId}/${workId}`).set({
    name,
    type,
    lines: JSON.stringify(lines),
    linesText: JSON.stringify(linesText),
    annotationObject: JSON.stringify(annotationObject),
  });

export const writeDiagramToDatabase = (
  userId,
  workId,
  name,
  type,
  rows,
  textObject,
  arrowsObject,
  additionalArrowsObject,
) =>
  db.ref(`work/${userId}/${workId}`).set({
    name,
    type,
    rows,
    textObject: JSON.stringify(textObject),
    arrowsObject: JSON.stringify(arrowsObject),
    additionalArrowsObject: JSON.stringify(additionalArrowsObject),
  });

export const onceGetWorks = (userId) => db.ref(`work/${userId}`).once('value');

export const onceGetWorkWithId = (userId, workId) =>
  db.ref(`work/${userId}/${workId}`).once('value');

export const updateWorkNode = (userId, update) => db.ref(`work/${userId}`).update(update);

export const writeToWorkCount = (id, newCount) =>
  db.ref(`workCount/${id}`).set({
    newWorkCount: newCount,
  });

export const onceGetWorkCount = (userId) => db.ref(`workCount/${userId}`).once('value');

export const deleteWork = (userId, workId) => db.ref(`work/${userId}/${workId}`).remove();
