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
  projectName,
  type,
  rows,
  columns,
  textsObject,
  bordersObject,
  alignmentsObject,
  caption,
  label,
) =>
  db.ref(`work/${userId}/${workId}`).set({
    projectName,
    type,
    rows,
    columns,
    textsObject: JSON.stringify(textsObject),
    bordersObject: JSON.stringify(bordersObject),
    alignmentsObject: JSON.stringify(alignmentsObject),
    caption,
    label,
  });

export const writeMathToDatabase = (
  userId,
  workId,
  projectName,
  type,
  linesLength,
  linesText,
  annotations,
) =>
  db.ref(`work/${userId}/${workId}`).set({
    projectName,
    type,
    linesLength: JSON.stringify(linesLength),
    linesText: JSON.stringify(linesText),
    annotations: JSON.stringify(annotations),
  });

export const writeDiagramToDatabase = (
  userId,
  workId,
  projectName,
  type,
  rows,
  textsObject,
  columnsObject,
  arrowsObject,
  additionalArrowsObject,
) =>
  db.ref(`work/${userId}/${workId}`).set({
    projectName,
    type,
    rows,
    textsObject: JSON.stringify(textsObject),
    columnsObject: JSON.stringify(columnsObject),
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
