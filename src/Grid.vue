<template>
  <div class="v-grid-wrapper" :style="gridWrapperStyle" ref="grid-wrapper">
    <div class="v-grid" :style="style" ref="grid">
      <GridItem
        v-for="v in list"
        v-if="itemsIsShown"
        :key="v.key"
        :index="v.index"
        :sort="v.sort"
        :draggable="draggable"
        :drag-delay="dragDelay"
        :column-count="columnCount"
        :cell-width="itemWidth"
        :cell-height="itemHeight"
        :scroll-offset="scrollOffset"
        @transitionend="() => onTransitionEnd(v.key)"
        @dragstart="(event) => onDragStart(event, v.key)"
        @dragend="onDragEnd"
        @drag="onDrag"
        @click="click"
      >
        <slot
          name="cell"
          :item="v.item"
          :index="v.index"
          :sort="v.sort"
          :remove="() => { removeItem(v) }"
        />
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
    numberOfColumns: {
      type: Number,
      default: 0,
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
    refScrollElement: {
      
    },
    wrapperStyles: {
      type: Object,
      default: () => ({}),
    },
    columns: {
      type: Number,
      default: 0,
    },
  },
  data () {
    return {
      list: [],
      scrollActive: false,
      scrollToDown: true,
      scrollOffset: 0,
      gridSize: {
        width: 0,
        height: 0,
      },
      currentScroll: 0,
      elementIdInMotion: null,
      itemsIsShown: false,
    };
  },
  created () {
    window.addEventListener("resize", this.resizeGrid);
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.resizeGrid);
  },
  mounted () {
    if (this.refScrollElement) {
      this.scrollElement = this.refScrollElement;
      this.$refs['grid-wrapper'].style['overflow'] = "visible";
    } else {
      this.scrollElement = this.$refs['grid-wrapper'];
      this.scrollElement.style['overflow-y'] = "auto";
    }

    this.$nextTick(() => {
      this.itemsIsShown = true;
    });
  },
  watch: {
    refScrollElement (val) {
      if (val) {
        this.scrollElement = val;
        this.$refs['grid-wrapper'].style['overflow'] = "visible";
      } else {
        this.scrollElement = this.$refs['grid-wrapper'];
        this.scrollElement.style['overflow-y'] = "auto";
      }
    },
    items: {
      handler (nextItems = []) {
        this.list = nextItems.map((item, index) => {
          const key = item.hasOwnProperty('id') ? item.id : index;
          return {
            item,
            index,
            key,
            sort: index,
          };
        });

        this.$nextTick(() => {
          this.resizeGrid();
        });
      },
      immediate: true,
    },
    scrollActive (val) {
      if (val) {
        this.startScroll();
      }
    },
    columns () {
      this.$nextTick(() => {
        this.resizeGrid();
      });
    },
  },
  computed: {
    height () {
      return Math.ceil(this.items.length / this.columnCount) * this.cellHeight;
    },

    style () {
      return {
        height: this.height + 'px',
      };
    },

    gridWrapperStyle () {
      if (this.gridSize.height > 0) {
        return {
          ...this.wrapperStyles,
          height: this.gridSize.height + 'px',
        };
      }

      return this.wrapperStyles;
    },

    columnCount () {
      if (this.columns > 0) {
        return this.columns;
      }
      
      return Math.floor(this.windowWidth / this.cellWidth);
    },

    itemWidth () {
      let itemWidth = this.columns > 0 && this.gridSize.width > 0 ?
        this.gridSize.width / this.columns :
        this.cellWidth;

      this.$emit('change-item-width', itemWidth);

      return itemWidth;
    },

    itemHeight () {
      return this.cellHeight;
    }
  },
  methods: {
    /* Returns merged event object */
    wrapEvent (other = {}) {
      return {
        datetime: Date.now(),
        items: this.getListClone(),
        ...other,
      };
    },
    /* Returns sorted clone of "list" array */
    getListClone () {
      return this.list
        .slice(0)
        .sort((a, b) => a.sort - b.sort);
    },

    removeItem ({ index }) {
      let removeItem = this.list.find(v => v.index === index);
      let removeItemSort = removeItem.sort;

      this.list = this.list
        .filter(v =>  v.index !== index)
        .map(v => {
          let sort = v.sort > removeItemSort
            ? (v.sort - 1)
            : v.sort;

          return { ...v, sort };
        });

      this.$emit('remove', this.wrapEvent({ index }));
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
      this.$emit('click', this.wrapEvent(event));
    },

    onDrag (event) {
      if (this.sortable) {
        this.sortList(event.index, event.gridPosition);
      }

      if (this.scrollElement) {
        let { pageY } = event.event;

        let mousePosition = pageY - this.scrollElement.offsetTop;
        let coef = mousePosition / this.scrollElement.clientHeight;

        this.scrollActive = coef < this.scrollZona || (1 - this.scrollZona) < coef;
        this.scrollToDown = coef > (1 - this.scrollZona);
      
        this.$emit('drag', this.wrapEvent({ event }));
      }
    },

    sortList (itemIndex, gridPosition) {
      let targetItem = this.list.find(item => item.index === itemIndex);
      let targetItemSort = targetItem.sort;

      /*
        Normalizing new grid position
      */
      gridPosition = Math.max(gridPosition, 0);
      /*
        If you remove this line you can drag items to positions that
        are further than items array length
      */
      gridPosition = Math.min(gridPosition, this.list.length - 1);

      if (targetItemSort !== gridPosition) {
        this.list = this.list.map(item => {
          if (item.index === targetItem.index) {
            return {
              ...item,
              sort: gridPosition,
            };
          }

          const { sort } = item;

          if (targetItemSort > gridPosition) {
            if (sort <= targetItemSort && sort >= gridPosition) {
              return {
                ...item,
                sort: sort + 1,
              };
            }
          }

          if (targetItemSort < gridPosition) {
            if (sort >= targetItemSort && sort <= gridPosition) {
              return {
                ...item,
                sort: sort - 1,
              };
            }
          }

          return item;
        });

        this.$emit('sort', this.wrapEvent());
      }
    },
    startScroll () {
      let offsetY = this.scrollToDown ? this.scrollStep : -(this.scrollStep);

      if (this.scrollElement) {
        let lastScrollTop = this.scrollElement.scrollTop;

        if (this.scrollElement.scrollBy) {
          this.scrollElement.scrollBy(0, offsetY);
        } else {
          // for Edge
          this.scrollElement.scrollTop = lastScrollTop + offsetY;
        }

        let currentScroll = this.scrollElement.scrollTop;

        let scrollElementHeight = this.scrollElement.offsetHeight;
        let childHeight = this.scrollElement.firstChild.offsetHeight;
        
        let scrollToUp = lastScrollTop > currentScroll;
        let scrollToDown = lastScrollTop < currentScroll && (currentScroll + scrollElementHeight) < childHeight;

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
    resizeGrid () {
      if (this.$refs.hasOwnProperty('grid-wrapper')) {
        let gridWrapper = this.$refs['grid-wrapper'];
        this.gridSize.width = gridWrapper.firstChild.clientWidth;
        this.gridSize.height = gridWrapper.firstChild.clientHeight;
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
