<template>
  <div id="app">
    <Home />
  </div>
</template>

<script>
import Home from "./components/Map/Map.vue";
export default {
  name: "App",
  components: { Home },
};
</script>

<style>
* {
  box-sizing: border-box;
}
html {
  font-family: sans-serif;
}
body {
  margin: 0;
  color: #000000;
}

#app {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 50px 0;
}
</style>
