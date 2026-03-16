<!-- 拖拽组件

<DraggableItem
  v-for="(item, index) in items"
  :key="item.id ?? index"
  :index="index"
  v-model:drag-index="dragIndex"
  v-model:drop-target-index="dropTargetIndex"
  @drop="handleDrop"
>
</DraggableItem>

const dragIndex = ref(null)
const dropTargetIndex = ref(null)

// 交换列表项位置
function handleDrop(fromIndex, toIndex) {
  const newItems = [...props.items]
  const temp = newItems[fromIndex]
  newItems[fromIndex] = newItems[toIndex]
  newItems[toIndex] = temp
  emit('reorder', newItems)
}

  -->

<template>
  <div
    class="draggable-row"
    :class="{
      'draggable-row--dragging': props.dragIndex === props.index,
      'draggable-row--over': props.dropTargetIndex === props.index
    }"
    draggable="true"
    @dragstart="handleDragStart"
    @dragover.prevent="handleDragOver"
    @dragleave="handleDragLeave"
    @dragend="handleDragEnd"
    @drop.prevent="handleDrop"
  >
    <slot />
  </div>
</template>

<script setup>

const props = defineProps({
  /** The index of this row in the list */
  index: {
    type: Number,
    required: true
  },
  dragIndex: {
    type: [Number, null],
    default: null
  },
  dropTargetIndex: {
    type: [Number, null],
    default: null
  }
})

const emit = defineEmits([
  'update:drag-index',
  'update:drop-target-index',
  'drag-start',
  'drag-over',
  'drag-leave',
  'drag-end',
  'drop'
])

function handleDragStart (event) {
  event.dataTransfer.effectAllowed = 'move'
  event.dataTransfer.setData('text/plain', String(props.index))

  emit('update:drag-index', props.index)
  emit('drag-start', props.index, event)
}

function handleDragEnd () {
  resetDragState()
  emit('drag-end')
}

function handleDragOver () {
  if (props.dragIndex === null || props.dragIndex === props.index) return

  emit('update:drop-target-index', props.index)
  emit('drag-over', props.index)
}

function handleDragLeave () {
  if (props.dropTargetIndex === props.index) {
    emit('update:drop-target-index', null)
  }
  emit('drag-leave', props.index)
}

function handleDrop () {
  if (props.dragIndex === null || props.dragIndex === props.index) {
    resetDragState()
    return
  }

  // Emit drop with both source and target indices BEFORE resetting state
  emit('drop', props.dragIndex, props.index)
  resetDragState()
}

function resetDragState () {
  emit('update:drag-index', null)
  emit('update:drop-target-index', null)
}
</script>

<style scoped>
.draggable-row {
  display: flex;
}
</style>
