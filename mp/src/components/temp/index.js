/*

// 在页面中声明自定义组件
"usingComponents": {
  "my-temp": "/components/temp/index",
}


// 使用自定义组件
<my-temp />
<my-temp></my-temp> // 使用插槽


// 自定义事件, 用于触发页面内事件
bind:myevent=""
this.triggerEvent('myevent'); // 自定义组件内触发页面事件
this.triggerEvent('myevent',DATA); // 传递参数
this.triggerEvent('myevent',DATA,{bubbles:true,composed:true});// 冒泡触发事件


// 声明自定义组件中的抽象节点, 需在usingComponents中定义
generic:generic=""
// 在自定义组件中声明默认抽象节点
"componentGenerics":{
  "generic":{"default":""}
},

 */

// let app = getApp();
// let appData = app.data;

let ComponentOpt = {
  // behaviors: [],
  // externalClasses: ['myclass'],
  // options: {
  //   addGlobalClass: true,
  //   multipleSlots: true,
  // },

  data: {
    
  },
  properties: {
    myprop: {
      type: Object,
      value: {},
      // observer(newVal, oldVal, changedPath) {
      //   if (!newVal) return;
      // },
    },
  },

  // lifetimes: {
  //   created() {},
  //   attached() {},
  //   ready() {},
  //   detached() {},
  // },
  // pageLifetimes: {
  //   show() {},
  //   hide() {},
  // },

  methods: {
    
  },
};

Component(ComponentOpt);
