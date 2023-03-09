export default {
  screenWidth: 340 * 3,
  screenHeight: 220 * 3,
  // screenWidth: 1366 * 3,
  // screenHeight: 768 * 3,
  backgroundColor: '#000000',
  physics: {
    default: 'matter',
    matter: {
      gravity: { y: .5 },
      debug: {
        showBody: true,
        showStaticBody: true
      }
    },
    // default: 'arcade',
    // arcade: {
    //   gravity: { y: 100 },
    //   debug: true
    // },
  },
}