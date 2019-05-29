<template>
  <div id="app">
    <img :src="require('#/images/info1.png')" alt="" style="width:100px;height:100px">
    <div id="nav">
      <router-link to="/">Home</router-link>|
      <router-link to="/about">About</router-link>
    </div>
    <router-view/>
  </div>
</template>

<style lang="less">

</style>
