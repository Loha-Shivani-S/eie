const fs = require('fs');
const filepath = 'c:/Users/lohas/Downloads/kec-main/kec-main/src/lib/mockData.ts';
let content = fs.readFileSync(filepath, 'utf8');

const updated = content.replace(/{([^}]+)}/g, (match, inner) => {
  const rollMatch = inner.match(/rollNo:\s*"(\d{2})[A-Z0-9]+"/);
  if (!rollMatch) return match;
  
  const prefix = rollMatch[1];
  let newYear = '';
  if (prefix === '22') newYear = 'IV';
  else if (prefix === '23') newYear = 'III';
  else if (prefix === '24') newYear = 'II';
  else if (prefix === '25') newYear = 'I';
  
  if (newYear) {
    return "{" + inner.replace(/year:\s*"([^"]+)"/, `year: "${newYear}"`) + "}";
  }
  return match;
});

fs.writeFileSync(filepath, updated);
console.log("Updated mockData.ts successfully.");
