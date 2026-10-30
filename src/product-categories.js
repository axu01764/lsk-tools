export const productCategorySlug=category=>category.toLowerCase().trim().replaceAll(' / ','-').replace(/\s+/g,'-');
export const productCategoryPath=category=>'/product/'+productCategorySlug(category)+'/';
export const productCategories=products=>[...new Set(products.map(item=>item.category))];
