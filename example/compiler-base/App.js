import { ref } from "../../lib/k-vue.esm.js";

export const App = {
  name: "App",
  template: `<div>hi,{{count}}</div>`,
  setup() {
    const count = (window.count = ref(1));
    console.log(count);
    return {
      count,
    };
  },
};
