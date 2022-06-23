export default function combineItens(...items: Array<Object>) {
  let rootItems = items[0];
  for (let i = 1; i < items.length; i++) {
    rootItems = Object.assign(items[i], rootItems);
  }
  return rootItems;
}
