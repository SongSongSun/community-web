<template>
  <div class="collapse">
    <div class="controls">
      <slot name="controls">
        <!--<export @click.native="$emit('export', $event)"></export>-->
      </slot>
      <div class="header" @click="visible =! visible">
        {{ visible ? '展开搜索': '收起搜索' }}
        <i :class="getClass" />
      </div>
    </div>
    <slot v-if="!visible" name="content" />
  </div>
</template>

<script>

export default {
  name: 'Collapse',
  data() {
    return {
      visible: false
    }
  },
  computed: {
    getClass() {
      return this.visible ? 'el-icon-arrow-down' : 'el-icon-arrow-up'
    }
  }
}
</script>

<style lang="scss">
  .collapse {
    margin-bottom: 20px;
    .controls {
      height: 32px;
      line-height: 32px;
      .export {
        float: left;
      }
      .header {
        float: right;
        cursor: pointer;
      }
    }
  }
</style>
