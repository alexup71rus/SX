const isMob = window.navigator.userAgent.toLowerCase().includes("mobi")
let scaleRange = 2

if (isMob) {
  scaleRange = +(window.innerWidth / window.outerWidth).toFixed(3)
}

export default {
  // @ts-ignore
  scaleRange: scaleRange,
  screenWidth: window.navigator.userAgent.toLowerCase().includes("mobi") ? window.innerWidth : 390 * scaleRange,
  // @ts-ignore
  screenHeight: window.navigator.userAgent.toLowerCase().includes("mobi") ? window.innerHeight : 844 * scaleRange,
  backgroundColor: '#fff',
  physics: {
    default: 'arcade',
    arcade: {
      debug: true
    },
  },
}