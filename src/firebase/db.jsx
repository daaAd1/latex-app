import { db } from './firebase';

// User API

export const doCreateUser = (id, username, email) =>
  db.ref(`users/${id}`).set({
    username,
    email,
  });

export const onceGetUsers = () => db.ref('users').once('value');

export const writeTableToDatabase = (
  id,
  workId,
  type,
  rows,
  columns,
  textInTable,
  caption,
  label,
) =>
  db.ref(`work/${id}/${workId}`).set({
    type,
    rows,
    columns,
    textInTable: JSON.stringify(textInTable),
    caption,
    label,
  });

export const writeMathToDatabase = (type, id, lines, linesText, annotationObject) =>
  db.ref(`work/${id}`).push({
    type,
    lines: JSON.stringify(lines),
    linesText: JSON.stringify(linesText),
    annotationObject: JSON.stringify(annotationObject),
  });

export const writeDiagramToDatabase = (
  type,
  id,
  rows,
  textObject,
  arrowsObject,
  additionalArrowsObject,
) =>
  db.ref(`work/${id}`).push({
    type,
    rows,
    textObject: JSON.stringify(textObject),
    arrowsObject: JSON.stringify(arrowsObject),
    additionalArrowsObject: JSON.stringify(additionalArrowsObject),
  });

export const onceGetWorks = id => db.ref(`work/${id}`).once('value');

export const writeToWorkCount = (id, newCount) =>
  db.ref(`workCount/${id}`).set({
    newWorkCount: newCount,
  });

export const onceGetWorkCount = id => db.ref(`workCount/${id}`).once('value');
