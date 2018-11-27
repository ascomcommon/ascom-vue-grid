<template>
  <div id="app">
    <div class="color-header">
      <Icon :color="selected" style="width: auto;">
        ascom-vue-grid
      </Icon>
    </div>
    <div class="grid-wrapper">
      <grid
        :center="false"
        :draggable="true"
        :sortable="true"
        :items="colors"
        :cellWidth="600"
        :cellHeight="400"
        :scroll-zona="0.3"
        :scroll-step="10"
        :scroll-interval="10"
        @change="change"
        @remove="remove"
        @click="click"
        @sort="sort">
        <template slot="cell" scope="props">
          <Icon :color="props.item"
                :index="props.index"
                :with-button="true"
                @remove="props.remove()"/>
        </template>
      </grid>
    </div>
  </div>

</template>

<script>
import Icon from './Icon.vue'
import { generateRGBColors } from './util'

export default {
  name: 'app',
  components: {
    Icon
  },
  data () {
    let colors = generateRGBColors(20);

    return {
      colors,
      selected: null,
    };
  },

  methods: {
    click ({ items, index }) {
      let value = items.find(v => v.index === index)
      this.selected = value.item

      console.log(this.selected)
    },

    change (event) {
      console.log('change', event)
    },

    remove (event) {
      console.log('remove', event)
    },

    sort (event) {
      console.log('sort', event)
    }
  }
}
</script>

<style lang="scss">
html, body {
  background: #fafafa;
  padding: 0;
  margin: 0;
  height: 100%;
}

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.color-header {
  position: relative;
  padding: 10px 0;
  box-sizing: border-box;
}

.grid-wrapper {
  overflow: hidden;
  flex: 1;
}

</style>
