// To test it, add this code

// import ES6Samle from './es6-sample';
// new ES6Samle(1,2).test();

export default class ES6Samle {
  constructor(x, y) {
    this.name = 'Test';
    this.x = x;
    this.y = y;
  }

  test() {
    console.log('Hi, I am a ', this.name + '. Values = ' + this.x + ', ' + this.y);
  }
}