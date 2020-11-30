// normalize response to a collection + array of Ids
// saves some array.prototype.find()'s and
// makes working with related data easier
export function normalizeResponse(data = []) {
  const entities = { byId: {}, allIds: [] };
  data.forEach((entity) => {
    entities.byId[entity.id] = entity;
    entities.allIds.push(entity.id);
  });
  return entities;
}

type DateSortable = { createdAt: string };

export function sortByCreatedAt(a: DateSortable, b: DateSortable) {
  return Date.parse(b.createdAt) - Date.parse(a.createdAt);
}
