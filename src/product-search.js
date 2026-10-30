const compact=value=>String(value||'').normalize('NFKD').toLowerCase().replace(/[^a-z0-9]/g,'');
export function matchesProduct(product,query) {
  const fields=['name','category','voltage','torque','speed','chuck','impactRate','manufacturerModel'];
  const text=fields.map(key=>compact(product[key])).join(' ');
  const terms=query.trim().split(/\s+/).map(compact).filter(Boolean);
  return terms.every(term=>text.includes(term));
}
