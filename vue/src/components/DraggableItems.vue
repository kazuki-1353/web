<!-- 拖拽组件

<DraggableItems
  :items="items"
  @update:items="newItems => emit('update:items', newItems)"
>
  <template #default="{ item, index }"></template>
</DraggableItems>

  -->

<template>
  <div
    v-for="(item, index) in items"
    :key="item[itemKey] ?? index"
    class="draggable-row"
    :class="{
      'draggable-row--dragging': dragIndex === index,
      'draggable-row--over': dropTargetIndex === index
    }"
    draggable="true"
    @dragstart="handleDragStart(index, $event)"
    @dragover.prevent="handleDragOver(index)"
    @dragleave="handleDragLeave(index)"
    @dragend="handleDragEnd"
    @drop.prevent="handleDrop(index)"
  >
    <slot
      :item="item"
      :index="index"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  items: {
    type: Array,
    default: () => []
  },
  itemKey: {
    type: String,
    default: 'id'
  }
})

const emit = defineEmits([
  'update:items' // (newItems: array)
])

// ── Drag-and-drop state ──
const dragIndex = ref(null)
const dropTargetIndex = ref(null)

function handleDragStart (index, event) {
  event.dataTransfer.effectAllowed = 'move'
  event.dataTransfer.setData('text/plain', String(index))
  dragIndex.value = index
}

function handleDragEnd () {
  resetDragState()
}

function handleDragOver (index) {
  if (dragIndex.value === null || dragIndex.value === index) return
  dropTargetIndex.value = index
}

function handleDragLeave (index) {
  if (dropTargetIndex.value === index) {
    dropTargetIndex.value = null
  }
}

function handleDrop (toIndex) {
  const fromIndex = dragIndex.value
  if (fromIndex === null || fromIndex === toIndex) {
    resetDragState()
    return
  }

  // Swap positions
  const newItems = [...props.items]
  const temp = newItems[fromIndex]
  newItems[fromIndex] = newItems[toIndex]
  newItems[toIndex] = temp

  emit('update:items', newItems)
  resetDragState()
}

function resetDragState () {
  dragIndex.value = null
  dropTargetIndex.value = null
}
</script>
