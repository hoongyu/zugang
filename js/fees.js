// uni-assist handling fee: EUR 75 for the first programme, EUR 30 for each additional one
// in the same application semester (rule "ua-fee").
export const UA_FIRST = 75;
export const UA_ADDITIONAL = 30;

/** @returns {{total:number, steps:string}} */
export function uniAssistFee(n) {
  if (!Number.isInteger(n) || n < 0) throw new RangeError('n must be a non-negative integer');
  if (n === 0) return { total: 0, steps: '0' };
  const extra = n - 1;
  const total = UA_FIRST + UA_ADDITIONAL * extra;
  const steps = extra === 0 ? `EUR ${UA_FIRST}` : `EUR ${UA_FIRST} + EUR ${UA_ADDITIONAL} × ${extra} = EUR ${total}`;
  return { total, steps };
}
