<template>
  <div id="app">
    <div class="color-header">
      <Icon :color="selected" style="width: auto;">
        ascom-vue-grid
      </Icon>
    </div>

    <div ref="scrollElement" class="scroll-element">
      <div class="scroll-element-child">
        <div class="expand-item">
          <Icon
            :color="expandColor"
            :with-button="true"
          />
        </div>

        <div class="grid">
          <grid
            :center="false"
            :draggable="true"
            :sortable="true"
            :items="colors"
            :cellWidth="300"
            :cellHeight="200"
            :scroll-zona="0.3"
            :scroll-step="10"
            :scroll-interval="10"
            :ref-scroll-element="scrollElement"
            :wrapper-styles="wrapperStyles"
            @alltransitionend="onTransitionEnd"
            @change="change"
            @remove="remove"
            @click="click"
            @sort="sort"
          >
            <template slot="cell" scope="props">
                  <Icon
                    :color="props.item"
                    :index="props.index"
                    :with-button="true"
                    @remove="props.remove()"
                  />
            </template>
          </grid>
        </div>
      </div>
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
      expandColor: { r: 200, g: 50, b: 50 },
      wrapperStyles: {  },
      scrollElement: null,
    };
  },

  mounted () {
    this.scrollElement = this.$refs.scrollElement;
  },

  methods: {
    click ({ items, index }) {
      let value = items.find(v => v.index === index)
      this.selected = value.item
    },

    onTransitionEnd () {
      console.log('onTransitionEnd');
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
  overflow: hidden;
}

.color-header {
  position: relative;
  padding: 10px 0;
  box-sizing: border-box;
}

.expand-item {
  width: 100%;
  height: 300px;
}

.scroll-element {
  overflow: auto;
  padding: 40px;
}

.scroll-element-child {
}

.grid {
  overflow: hidden;
  flex: 1;
}

</style>
