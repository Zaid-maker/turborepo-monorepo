const string =
  "The customer is very important, the customer will be followed by the customer. But sometimes there is a laoreet, in grief, nor porttitor at. Always put Aeneas in Leo football. It's a soft job, that's what the airline needs. Now the throat of the quiver. The customer is very important, the customer will be followed by the customer. Until the Internet is not followed. Aenean's land borders the land but time. Some of the needs of God's life need to be poisoned. Some people now spend their days drinking just the valley or whatever Aenean's body is now itself, but the vehicles are just convenient to use. It's a little bit of a trigger, but it's just a shot of yeast. There is nothing easy. Phasellus hendrerit ultrices purus, eu fringilla lectus consectetur id. Each land is read, sad and not targeted, the price and justice. It's a good idea for me to be flattered by the temperature of the temperature and the level. Aenean urn tortor, placerat who was life, chocolate is eleifend. Aenean sauce, eros who is saddened, it was not said to the orci, but to drink pure laughter vehicles tortor. It's going to be a big game ahead. There were no children, the pain was easy, and he was very anxious, and in the fringilla, he was as great as a man. There is no sauce, the trigger is not running on the target, the employee is pure, whether it's time for bed or bed. In real estate, that element takes over. My monitor, not the port or the port, I'm a developer. Aenean's lake itself, whether it be grief or death, takes care of the world. Maecenas needed to be wanted and the bow was sometimes mournful. So that the price of arrows is wise from grief. Now he invests sometimes in ultricia. Donec at neque eu nisl laoreet pellentesque in and fear. So that the sad mass but advertises to invest, or sometimes wants to lacinia. We live in the time of the arc from my employee, not the fringing time of the rhoncus. Even the lion of life, the urn of eleifend fringilla. It is necessary for the players to be in the employee's life for the time or the life before. It was a weekend. Even at the end of the corporal, the land and the sea, the sad players. The mass of the world, the economy, and the life of the people, are targeted, but not at all. This is the biggest megalopolis, it's done, it's done, it's done. In the but dui that as many layers as that and the urn. Now life's pain and pain must be drunk, but from a bottle. It's not always fun, and it's always fun. Fear of death by arrows. In order not to put the lake. The children of the family bow to the greatest children. Donec malesuada fringilla hate, at luctus nibh homework a But it is not without concern that who should drink, who should be dressed first. Donec Euismod cartoon just and arrows. Aeneas is expected and it is very important sometimes. Proin eleifend, now in sollicitudin Euismod, dolor dolor porta libero, let it be a lot of grief if mi placerat tortor.";

export function generateParagraphUsingLoremIpsum() {
  const words = string.split(" ");
  const paragraph = [];
  for (let i = 0; i < 50; i++) {
    paragraph.push(words[Math.floor(Math.random() * words.length)]);
  }
  return paragraph.join(" ").toLowerCase();
}

export async function generateParagraph() {
  try {
    const response = await fetch("http://metaphorpsum.com/paragraphs/10");

    if (!response.ok) {
      throw new Error();
    }

    const data = await response.text();
    const paragraph = data.split(`\n`).join(" ");

    return paragraph;
  } catch (e) {
    console.log(e);
    const paragraph = generateParagraphUsingLoremIpsum();
    return paragraph;
  }
}
