<template>
  <div class="v-grid-wrapper" :style="gridWrapperStyle" ref="grid-wrapper">
    <div class="v-grid" :style="style" ref="grid">
      <GridItem v-for="v in list"
                :key="v.key"
                :index="v.index"
                :sort="v.sort"
                :draggable="draggable"
                :drag-delay="dragDelay"
                :row-count="rowCount"
                :cell-width="cellWidth"
                :cell-height="cellHeight"
                :window-width="windowWidth"
                :row-shift="rowShift"
                :scroll-offset="scrollOffset"
                @transitionend="() => onTransitionEnd(v.key)"
                @dragstart="(event) => onDragStart(event, v.key)"
                @dragend="onDragEnd"
                @drag="onDrag"
                @click="click">
        <slot name="cell"
              :item="v.item"
              :index="v.index"
              :sort="v.sort"
              :remove="() => { removeItem(v) }"/>
      </GridItem>
    </div>
  </div>
</template>
<script>
import windowSize from './mixins/window_size.js'
import GridItem from './GridItem.vue'

export default {
  name: 'Grid',
  mixins: [windowSize],
  components: {
    GridItem
  },
  props: {
    items: {
      type: Array,
      default: () => []
    },
    cellWidth: {
      type: Number,
      default: 80,
    },
    cellHeight: {
      type: Number,
      default: 80
    },
    draggable: {
      type: Boolean,
      default: false
    },
    dragDelay: {
      type: Number,
      default: 0
    },
    sortable: {
      type: Boolean,
      default: false
    },
    center: {
      type: Boolean,
      default: false
    },
    scrollZona: {
      type: Number,
      default: 0.25,
    },
    scrollStep: {
      type: Number,
      default: 10,
    },
    scrollInterval: {
      type: Number,
      default: 10,
    },
  },
  data () {
    return {
      list: [],
      scrollActive: false,
      scrollToDown: true,
      scrollOffset: 0,
      gridWrapperHeight: null,
      currentScroll: 0,
      elementIdInMotion: null,
    }
  },
  created () {
    window.addEventListener("resize", this.resizeGridHeight);
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.resizeGridHeight);
  },
  mounted () {
    this.resizeGridHeight();
  },
  watch: {
    items: {
      handler: function (nextItems = []) {
        this.list = nextItems.map((item, index) => {
          const key = item.hasOwnProperty('id') ? item.id : index;
          return {
            item,
            index,
            key,
            sort: index
          }
        })
      },
      immediate: true
    },
    scrollActive(val) {
      if (val) {
        this.startScroll();
      }
    },
  },
  computed: {
    height () {
      return Math.ceil(this.items.length / this.rowCount) *
        this.cellHeight
    },

    style () {
      return {
        height: this.height + 'px'
      }
    },

    gridWrapperStyle () {
      if (Number.isInteger(this.gridWrapperHeight)) {
        return {
          height: this.gridWrapperHeight + 'px',
        };
      }

      return null;
    },

    rowCount () {
      return Math.floor(this.windowWidth / this.cellWidth)
    },

    rowShift () {
      if (this.center) {
        let contentWidth = this.items.length * this.cellWidth
        let rowShift = contentWidth < this.windowWidth
          ? (this.windowWidth - contentWidth) / 2
          : (this.windowWidth % this.cellWidth) / 2

        return Math.floor(rowShift)
      }

      return 0
    }
  },
  methods: {
    /* Returns merged event object */
    wrapEvent (other = {}) {
      return {
        datetime: Date.now(),
        items: this.getListClone(),
        ...other
      }
    },
    /* Returns sorted clone of "list" array */
    getListClone () {
      return this.list
        .slice(0)
        .sort((a, b) => {
          return a.sort - b.sort
        })
      //  .map(v => {
      //    return { ...v.item }
      //  })
    },

    removeItem ({ index }) {
      let removeItem = this.list.find(v => v.index === index)
      let removeItemSort = removeItem.sort

      this.list = this.list
        .filter(v => {
          return v.index !== index
        })
        .map(v => {
          let sort = v.sort > removeItemSort
            ? (v.sort - 1)
            : v.sort

          return { ...v, sort }
        })

      this.$emit('remove', this.wrapEvent({ index }))
    },

    onDragStart (event, id) {
      this.elementIdInMotion = id;

      this.$emit('dragstart', this.wrapEvent(event));
    },

    onDragEnd (event) {
      this.scrollActive = false;
      this.scrollOffset = 0;

      this.$emit('dragend', this.wrapEvent(event));
    },

    onTransitionEnd (id) {
      if (this.elementIdInMotion === id) {
        this.$emit('alltransitionend');
      }
    },

    click (event) {
      this.$emit('click', this.wrapEvent(event))
    },

    onDrag (event) {
      if (this.sortable) {
        this.sortList(event.index, event.gridPosition)
      }

      if (this.$refs.hasOwnProperty('grid-wrapper') && this.$refs.hasOwnProperty('grid')) {
        let gridWrapper = this.$refs['grid-wrapper'];

        let { pageY } = event.event;
        let wrapperPositionY = gridWrapper.offsetTop;
        let gridHeight = gridWrapper.clientHeight;

        let mousePosition = pageY - wrapperPositionY;

        let coef = mousePosition / gridHeight;

        this.scrollActive = coef < this.scrollZona || (1 - this.scrollZona) < coef;
        this.scrollToDown = coef > (1 - this.scrollZona);
      }
      
      this.$emit('drag', this.wrapEvent({ event }));
    },

    sortList (itemIndex, gridPosition) {
      let targetItem = this.list.find(item => item.index === itemIndex)
      let targetItemSort = targetItem.sort

      /*
        Normalizing new grid position
      */
      gridPosition = Math.max(gridPosition, 0)
      /*
        If you remove this line you can drag items to positions that
        are further than items array length
      */
      gridPosition = Math.min(gridPosition, this.list.length - 1)

      if (targetItemSort !== gridPosition) {
        this.list = this.list.map(item => {
          if (item.index === targetItem.index) {
            return {
              ...item,
              sort: gridPosition
            }
          }

          const { sort } = item

          if (targetItemSort > gridPosition) {
            if (sort <= targetItemSort && sort >= gridPosition) {
              return {
                ...item,
                sort: sort + 1
              }
            }
          }

          if (targetItemSort < gridPosition) {
            if (sort >= targetItemSort && sort <= gridPosition) {
              return {
                ...item,
                sort: sort - 1
              }
            }
          }

          return item
        })

        this.$emit('sort', this.wrapEvent())
      }
    },
    startScroll () {
      let offsetY = this.scrollToDown ? this.scrollStep : -(this.scrollStep);

      if (this.$refs.hasOwnProperty('grid-wrapper')) {
        let gridWrapper = this.$refs['grid-wrapper'];
        let gridWrapperHeight = gridWrapper.offsetHeight;

        let gridHeight = this.$refs['grid'].offsetHeight;

        let lastScrollTop = gridWrapper.scrollTop;
        gridWrapper.scrollBy(0, offsetY);
        let currentScroll = gridWrapper.scrollTop;

        let scrollToUp = lastScrollTop > currentScroll;
        let scrollToDown = lastScrollTop < currentScroll && (currentScroll + gridWrapperHeight) < gridHeight;

        if (scrollToUp && offsetY < 0 || scrollToDown && offsetY > 0) {
          let newScrollOffset = this.scrollOffset + offsetY;
          this.scrollOffset = newScrollOffset;

          setTimeout(() => {
            if (this.scrollActive) {
              this.startScroll();
            }
          }, this.scrollInterval);
        }
      }
    },
    resizeGridHeight () {
      if (this.$refs.hasOwnProperty('grid-wrapper')) {
        let gridWrapper = this.$refs['grid-wrapper'];
        let parentHeight = gridWrapper.parentElement.clientHeight;

        this.gridWrapperHeight = parentHeight;
      }
    },
  }
}
</script>
<style lang="scss">
.v-grid-wrapper {
  height: 100%;
  overflow-x: hidden;
  overflow-y: auto;
  @media print {
    height: auto !important;
  }
}

.v-grid {
  display: block;
  position: relative;
  width: 100%;
  @media print {
    height: auto !important;
  }
}
</style>
