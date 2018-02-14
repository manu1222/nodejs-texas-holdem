const PokerEvaluator = require('poker-evaluator');
const chalk = require('chalk');
const _ = require('lodash/fp');

const product = (a, b) => _.flatMap(v => _.map(w => `${v}${w}`, b), a);
const ranks = Object.freeze(Array.from('AKQJT98765432'));
const playingCards = {
  K: 'King',
  Q: 'Queen',
  J: 'Jack',
  T: 'Ten',
  9: 'Nine',
  8: 'Eight',
  7: 'Seven',
  6: 'Six',
  5: 'Five',
  4: 'Four',
  3: 'Three',
  2: 'Two',
  A: 'Ace',
};

const output = (players) => {
  players.forEach((player, i) => {
    console.log(`${i + 1}. ${player.name} ${player.handName}`);
  });
};

const getCardName = card => playingCards[card.toUpperCase()];

const sortThemOut = cards =>
  getCardName(cards.map(d => d[0]).sort((a, b) => ranks.indexOf(a) - ranks.indexOf(b))[0]);

const getPairs = cards => cards
  .map(d => d[0])
  .reduce((acc, el, i, arr) => {
    if (arr.indexOf(el) !== i && acc.indexOf(el) < 0) acc.push(el);
    return acc;
  }, [])
  .sort((a, b) => b - a);

const getIcon = (cardType) => {
  const number = cardType.slice(0, 1);
  switch (cardType.slice(1, 2)) {
    case 's':
      return `${number}${chalk.green('♠')}`;
    case 'h':
      return `${number}${chalk.red('♥')}`;
    case 'd':
      return `${number}${chalk.yellow('♦')}`;
    case 'c':
      return `${number}${chalk.blue('♣')}`;
    default:
      break;
  }
  return '';
};

const displayCards = cards => cards
  .map(card => getIcon(card))
  .join(' ');

const ucfirst = str => str.replace(
  /\w+\s*/g,
  txt => txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase(),
);

const fillDeck = () => product('AKQJT98765432', 'hcds');

const generateHandName = (handName, handType, communityCards, playerCards) => {
  const suits = communityCards.concat(playerCards);
  switch (handType) {
    case 2: // one pair
      return `Pair ${getPairs(suits).join(', ')}`;
    case 3: // two pair
      return `${ucfirst(handName)} ${getPairs(suits)
        .map(card => getCardName(card))
        .join(' ')}`;
    case 5: // straight
      return `${ucfirst(handName)} ${sortThemOut(suits)}`;
    default:
      break;
  }
  return '';
};

const evaluateHands = ({ communityCards, players }) => {
  return players.map((player) => {
    const mArray = communityCards.concat(player.cards);
    const res = PokerEvaluator.evalHand(mArray);
    return {
      name: player.name,
      cards: player.cards,
      rank: res.handRank,
      handName: generateHandName(
        res.handName,
        res.handType,
        communityCards,
        player.cards,
      ),
    };
  }).sort((a, b) => (a.rank < b.rank ? -1 : 1));
};

module.exports = {
  displayCards,
  evaluateHands,
  output,
  getIcon,
};
