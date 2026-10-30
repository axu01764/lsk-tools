export const newsCategories = [
  {id:'company-news',label:'Company news'},
  {id:'industry-news',label:'Industry news'}
];
export function newsPath(item) {
  return newsCategories.some(category => category.id === item.category)
    ? `/news/${item.category}/${item.id}.html`
    : `/news/${item.id}/`;
}
