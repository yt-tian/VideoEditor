<template>
  <div class="com-input">
    <input 
      :type="inputType"
      class="input__inner"
      :placeholder="placeholder"
      :name="name"
      :disabled="disabled"
      :class="{ 'is-disabled': disabled }"
      :value="value"
      maxlength="30"
      @input="(e) => $emit('input', e.target.value)" />
    <span class="input__suffix" v-if="showSuffix">
      <!-- <i
        class="input__icon icon-circle-close"
        v-if="clearable && value"
        @click="clear"
      ></i> -->
      <span
        class="eyes"
        :class="{ 'eyes-active': pwdVisible }"
        v-if="hasShowPwd"
        @click="() => pwdVisible = !pwdVisible"
      ></span>
    </span>
  </div>
</template>
<script>

export default {
  name: 'com-input',
  props: {
    placeholder: {
      type: String,
      default: "",
    },
    type: {
      type: String,
      default: "text",
    },
    name: {
      type: String,
      default: "",
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    value: {
      type: String,
      default: "",
    },
    clearable: {
      type: Boolean,
      default: false,
    },
    hasShowPwd: {
      type: Boolean,
      default: false,
    }
  },
  data() {
    return {
      pwdVisible: false,
    }
  },
  computed: {
    showSuffix() {
      return this.clearable || this.hasShowPwd;
    },
    inputType() {
      console.log(this.pwdVisible , this.value);
      return this.hasShowPwd ? (this.pwdVisible ? 'text' : 'password') : this.type
    }
  },
  mounted() {},
  methods: {}
}
</script>
<style scoped>
.com-input {
  padding-left: 10px;
  border-bottom: 0.5px solid #646464;
}
.input__inner {
  height: 55px;
  width: calc(100% - 10px);
  text-align: left;
  background: none;
  border: none;
  color: #fff;
  font-size: 14px;
  outline: none;
}

input::-webkit-input-placeholder {
  color: #fff;
  font-size: 14px;
  /* padding-left: 10px; */
}


.input__suffix {
  position: absolute;
  right: 24px;
  top: 76px;
}
.eyes {
  display: inline-block;
  width: 30px;
  height: 30px;
  background: url(@/assets/images/eyes.png) center center no-repeat;
  cursor: pointer;
}
.eyes-active{
  background-color: red;
}
</style>
