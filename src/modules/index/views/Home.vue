<template>
  <div class="home">
    <img :src="require('@@/images/news-bg.png')" alt="">
    <ul class="module-list">
      <li class="module-item"
          v-for="(module,index) in modulesConfig"
          :key="index"
          :style="modulesConfig[index].style">
        <a class="module-href"
           :href="`../${module.moduleName}/${module.moduleName}.html`">
          <img class="module-logo"
               :src="module.logo">
          <h2 class="module-title">{{module.title}}</h2>
          <h2 class="module-author">{{module.author}}</h2>
          <p class="module-text">{{module.text}}</p>
        </a>
      </li>
    </ul>
  </div>
</template>

<script>
	import {modulesConfig} from '../assets/getModulesConfig'

	export default {
		name: 'home',
		components: {},
		data () {
			return {
				modulesConfig,
			}
		},
		computed: {},
		created () {
			this.getModulesStyle()
		},
		methods: {
			getModulesStyle () {
				this.modulesConfig.map((item, index, array) => {
					let newStyle = {}
					newStyle.backgroundColor = item.style.backgroundColor || '#8b8b8b'
					newStyle.backgroundImage = `url(${item.style.backgroundImage})` || ''
					newStyle.color = item.style.color || '#ffffff'
					array[index].style = newStyle
				})
			}
		}
	}
</script>
<style lang="less">
  .module-list {
    width:100%;
    min-width:1200px;
    display:flex;
    flex-wrap:wrap;
    box-sizing:border-box;
    padding:100px;
  }
  .module-item {
    width:240px;
    height:400px;
    margin:0 20px 20px 0;
    background-repeat:no-repeat;
    background-size:100% auto;
  }
  .module-href {
    display:flex;
    flex-direction:column;
    align-items:center;
    width:100%;
    height:100%;
    padding:20px;
    box-sizing:border-box;
  }
  .module-logo {
    width:180px;
    height:180px;
    border-radius:50%;
  }
  .module-title {
    margin:20px 0 10px;
    font-size:18px;
    font-weight:bold;
  }
  .module-author {
    font-size:14px;
  }
  .module-text {
    font-size:16px;
    margin-top:10px;
  }
</style>
