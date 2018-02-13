const shuffle = require("shuffle-array");
const PokerEvaluator = require("poker-evaluator");
const chalk = require("chalk");

class Common {
  constructor() {
    this.playingCards = {
      K: "King",
      Q: "Queen",
      J: "Jack",
      T: "Ten",
      9: "Nine",
      8: "Eight",
      7: "Seven",
      6: "Six",
      5: "Five",
      4: "Four",
      3: "Three",
      2: "Two",
      A: "Ace"
    };

    this.ranks = [
      "A",
      "K",
      "Q",
      "J",
      "T",
      "9",
      "8",
      "7",
      "6",
      "5",
      "4",
      "3",
      "2"
    ];
  }

  output(players) {
    players.forEach((player, i) => {
      console.log(`${i + 1}. ${player.name} ${player.handName}`);
    });
  }

  evaluateHands({ communityCards, players }) {
    let ranking = [];
    players.map(player => {
      const mArray = communityCards.concat(player.cards);
      const res = PokerEvaluator.evalHand(mArray);
      ranking.push({
        name: player.name,
        cards: player.cards,
        rank: res.handRank,
        handName: this.generateHandName(
          res.handName,
          res.handType,
          communityCards,
          player.cards
        )
      });
    });
    ranking.sort((a, b) => {
      return a.rank < b.rank ? -1 : 1;
    });

    return ranking;
  }

  generateHandName(handName, handType, communityCards, playerCards) {
    const suits = communityCards.concat(playerCards);
    switch (handType) {
      case 2: //one pair
        return `Pair ${this.getPairs(suits).join(", ")}`;
      case 3: //two pair
        return `${this.ucfirst(handName)} ${this.getPairs(suits)
          .map(card => {
            return this.getCardName(card);
          })
          .join(" ")}`;
      case 5: //straight
        return `${this.ucfirst(handName)} ${this.sortThemOut(suits)}`;
        break;
    }
  }

  sortThemOut(cards) {
    return this.getCardName(
      cards.map(d => d[0]).sort((a, b) => {
        return this.ranks.indexOf(a) - this.ranks.indexOf(b);
      })[0]
    );
  }
  
  getPairs(cards) {
    return cards
      .map(d => d[0])
      .reduce(function(acc, el, i, arr) {
        if (arr.indexOf(el) !== i && acc.indexOf(el) < 0) acc.push(el);
        return acc;
      }, [])
      .sort((a, b) => b - a);
  }

  getCardName(card) {
    return this.playingCards[card.toUpperCase()];
  }

  displayCards(cards) {
    return cards
      .map(card => {
        return this.getIcon(card);
      })
      .join(" ");
  }

  getIcon(cardType) {
    const number = cardType.slice(0, 1);
    const icon = cardType.slice(1, 2);
    switch (cardType.slice(1, 2)) {
      case "s":
        return `${number}${chalk.green("♠")}`;
      case "h":
        return `${number}${chalk.red("♥")}`;
      case "d":
        return `${number}${chalk.yellow("♦")}`;
      case "c":
        return `${number}${chalk.blue("♣")}`;
    }
  }

  ucfirst(str) {
    return str.replace(
      /\w+\s*/g,
      txt => txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase()
    );
  }
}

module.exports = {
  Common
};
