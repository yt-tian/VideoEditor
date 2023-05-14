<template>
  <div class="official-page">
    <div class="official-search">
      <OfficialSearch @searchOfficialHander="searchOfficialHander"/>
    </div>
    <div class="official-list">
     <Official v-if="test.length" :test="test"/>
     <EmptyOffcial />
    </div>
  </div>
</template>
<script>
import OfficialSearch from './official-search.vue'
import Official from './official.vue'
import EmptyOffcial from './empty-offcial.vue'
export default {
  components: {
    OfficialSearch,
    Official,
    EmptyOffcial,
  },
  data() {
    return {
      test:[]
    }
  },
  computed:{

  },
  mounted(){

  },
  methods:{
    searchOfficialHander (keyword) {
      console.log("文案：",keyword);
      this.test = [ {
          official:
            "出门在外，要留心自己👀要点1️⃣：出门前准备准备好护肤品 🧖‍♀️、防晒霜 ☀️、遮阳伞 ☂️、口罩 😷、消毒手 gel 🤲 等，重要的出门必需品一定要随身携带哦！要点2️⃣：交通安全遵守交通规则 🚥，注意交通安全，特别是在人流量大的地方 🚶‍♀️🚶‍♂️，尽量不要用手机 📱 或听音乐 🎵，以免分神而触碰到危险。要点3️⃣：人身安全出门在外，要注意自身安全 😨，如遇到可疑人员 🕵️‍♀️，一定要保持警惕，及时寻求帮助。此外，提前了解周边环境、路线规划等也是很重要的哦！总结：出门在外，安全第一，各种优质产品也不能少！记得防晒，戴口罩，注意交通安全，重要的事情再怎么走，不要忘记提早防范哦！标签： #出门在外 #旅游 #出游必备 #交通安全 #人身安全 #安全第一",
        },]
    }
  },
}
</script>
<style scoped>
.official-page{
  flex: 1;
  display: flex;
  height: 100%;
}
.official-search{
  width: 300px;
  border-right: 1px solid #e3e4e5;
}
.official-list{
  flex: 1;
}



</style>
