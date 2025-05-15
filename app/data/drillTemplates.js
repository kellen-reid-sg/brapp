/**
 * @typedef {Object} DrillTemplate
 * @property {string} id - Unique identifier for the drill template
 * @property {string} title - Title of the drill template
 * @property {string} category - Category/type of the drill
 * @property {string[]} ageGroups - Age groups this drill is suitable for
 * @property {number} duration - Duration of the drill in minutes
 * @property {string} description - Description of the drill
 * @property {string} setup - Instructions for setting up the drill
 */

/**
 * Array of drill templates
 * @type {DrillTemplate[]}
 */
export const drillTemplates = [
  {
    id: '1',
    title: 'Passing Square',
    category: 'Passing',
    ageGroups: ['U8', 'U10', 'U12', 'U14'],
    duration: 15,
    description: 'A simple passing drill to improve accuracy and first touch',
    setup: 'Set up a 10x10 yard square with 4 players, one at each corner. Players pass the ball clockwise around the square with one-touch passing.'
  },
  {
    id: '2',
    title: '3v1 Rondo',
    category: 'Possession',
    ageGroups: ['U10', 'U12', 'U14', 'U16', 'U18'],
    duration: 10,
    description: 'Small-sided possession game to improve quick passing under pressure',
    setup: 'Create a 6x6 yard square. 3 players position themselves around the outside, with 1 defender in the middle. The 3 outside players try to keep possession while the defender attempts to win the ball.'
  },
  {
    id: '3',
    title: 'Shooting Circuit',
    category: 'Finishing',
    ageGroups: ['U12', 'U14', 'U16', 'U18'],
    duration: 20,
    description: 'A shooting drill focused on different types of finishes',
    setup: 'Set up 3 shooting stations around the penalty area. Players rotate through each station, practicing different shooting techniques: 1) First-time shots, 2) Turn and shoot, 3) Dribble and shoot.'
  },
  {
    id: '4',
    title: '1v1 Defender/Attacker',
    category: 'Defending',
    ageGroups: ['U10', 'U12', 'U14', 'U16', 'U18'],
    duration: 15,
    description: 'One-on-one drill to improve defensive positioning and offensive skills',
    setup: 'Create a 15x10 yard rectangle with a small goal at one end. One player starts as the defender, the other as attacker. The attacker tries to score while the defender tries to win the ball and clear it past the end line.'
  },
  {
    id: '5',
    title: 'Conditioning Ladder',
    category: 'Fitness',
    ageGroups: ['U12', 'U14', 'U16', 'U18'],
    duration: 15,
    description: 'Fitness drill combining sprints with ball work',
    setup: 'Place 5 cones in a straight line, 5 yards apart. Players start at first cone, sprint to the second, back to first, then to third, back to first, etc. Complete with a ball for an added challenge.'
  }
];