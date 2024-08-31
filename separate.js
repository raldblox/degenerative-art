const fs = require("fs");

function findInvalidEmojiCounts(filename) {
  const data = JSON.parse(fs.readFileSync(filename, "utf8"));

  const invalidEmojis = {};
  for (const item of data) {
    const emojiCount = item.emojis.length;
    if (emojiCount !== 9) {
      invalidEmojis[item.tokenId] = emojiCount;
    }
  }

  return invalidEmojis;
}

function writeToJSON(data, filename) {
  fs.writeFileSync(filename, JSON.stringify(data, null, 2));
}

const invalidCounts = findInvalidEmojiCounts("v2.json");
writeToJSON(invalidCounts, "invalidEmojiCount.json");

console.log("Invalid emoji counts written to invalidEmojiCount.json");
