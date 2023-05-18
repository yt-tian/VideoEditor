export default class WaterFall {

  constructor(options) {
    this.containerDom = options.dom;
    // this.column = options.column;
    this.gap = options.gap;
    // console.log(this.containerDom)
    this.itemsDom = this.containerDom.getElementsByTagName('li');
    if (this.itemsDom && this.itemsDom.length) {
      this.itemDomWidth = this.itemsDom[0].offsetWidth;
      const containerWidth = this.containerDom.offsetWidth
      // console.log(containerWidth, this.itemDomWidth)
      this.column = Math.floor(containerWidth / (this.itemDomWidth + this.gap));

      this.baseLeft = (containerWidth - (this.column * this.itemDomWidth ) - this.gap * (this.column - 1)) / 2

      // console.log('this.column: ' + this.column);
      this.layout();
   }
  }

  layout() {
    const heightList = [];
    let minIndex = -1;
    for (let i = 0; i < this.itemsDom.length; i++) {
      const itemDom = this.itemsDom[i];
      if (i < this.column) {
        itemDom.style.top = '0px';
        itemDom.style.left = i * (this.itemDomWidth + this.gap) + this.baseLeft + 'px';
        heightList.push(itemDom.offsetHeight);
      } else {
        minIndex = heightList.indexOf(Math.min(...heightList));
        itemDom.style.left = this.itemsDom[minIndex].offsetLeft + 'px';
        itemDom.style.top = heightList[minIndex] + this.gap + 'px';
        heightList[minIndex] += itemDom.offsetHeight + this.gap;
      }
      // console.log(heightList)
    }
  }
}