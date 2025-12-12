<template>
  <router-view />
</template>

<script setup>
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=Merriweather:wght@300;400;700&display=swap");

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: "Merriweather", serif;
}

html,
body,
#app {
  width: 100%;
  height: 100%;
  min-height: 100%;
  margin: 0;
  padding: 0;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
}

router-view,
.router-view {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
}
</style>