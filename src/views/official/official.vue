<template>
  <div class="container">
    <ul>
      <li v-for="(item, index) in test" :key="index">
        {{ item.official }}
      </li>
    </ul>
    <div class="crawl-more">
      <button class="more" @click="keyCopy()">一键复制</button>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    test: {
      type: Array,
      default: []
    }
  },
  data() {
    return {
      // official: [
      //   {
      //     official:
      //       "出门在外，要留心自己👀要点1️⃣：出门前准备准备好护肤品 🧖‍♀️、防晒霜 ☀️、遮阳伞 ☂️、口罩 😷、消毒手 gel 🤲 等，重要的出门必需品一定要随身携带哦！要点2️⃣：交通安全遵守交通规则 🚥，注意交通安全，特别是在人流量大的地方 🚶‍♀️🚶‍♂️，尽量不要用手机 📱 或听音乐 🎵，以免分神而触碰到危险。要点3️⃣：人身安全出门在外，要注意自身安全 😨，如遇到可疑人员 🕵️‍♀️，一定要保持警惕，及时寻求帮助。此外，提前了解周边环境、路线规划等也是很重要的哦！总结：出门在外，安全第一，各种优质产品也不能少！记得防晒，戴口罩，注意交通安全，重要的事情再怎么走，不要忘记提早防范哦！标签： #出门在外 #旅游 #出游必备 #交通安全 #人身安全 #安全第一",
      //   },
      // ],
    };
  },
  computed: {},
  mounted() {},
  methods: {},
};
</script>
<style scoped>
.empty > .get-font {
  padding: 14px 0 6px 0;
  font-weight: bold;
  font-size: 14px;
}
.empty > .font {
  font-size: 12px;
  color: #999;
}
.more {
  position: absolute;
  bottom: 36px;
  width: 78px;
  height: 30px;
  border-radius: 2px;
  border: none;
  cursor: pointer;
  color: #fff;
  background: #2254f4;
  font-family: Source Han Sans CN;
  font-size: 12px;
}

.crawl-more {
  width: 774px;
  display: flex;
  position: relative;
  justify-content: end;
  align-items: center;
}

.importMaterial {
  position: absolute;
  left: 36%;
  top: 50%;
  font-size: 12px;
  border: none;
  border-radius: 15px;
  width: 76px;
  cursor: pointer;
  height: 20px;
  background-color: #dadcdd;
}
.container {
  height: 100%;
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  background-color: #f6f7f9;
}

.container > .empty {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 774px;
  height: 563px;
  border-radius: 20px;
  border: 2px #000 dashed;
}

.container ul {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  width: 774px;
  height: 563px;
}
.container ul > li {
  font-family: Source Han Sans CN;
  font-size: 12px;
  font-weight: normal;
  line-height: 20px;
  letter-spacing: 0em;
  color: #3d3d3d;
  padding: 30px;
  box-sizing: border-box;
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 10px;
  background-color: #fff;
}
</style>
