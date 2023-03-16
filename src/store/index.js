import { createStore } from "vuex";

// 创建一个新的 store 实例
const store = createStore({
  state() {
    return {
      count: "这是一条vuex测试消息",
    };
  },
  mutations: {
    increment(state) {
      state.count++;
    },
  },
});

export default store;
