<script setup lang="ts" generic="T extends Record<string, unknown>">
import type { TableColumn } from './types'

defineProps<{
  columns: TableColumn<T>[]
  rows: T[]
  rowKey: (row: T) => string | number
  stickyHeader?: boolean
}>()

function cellClass(col: TableColumn<T>, row: T): string {
  if (!col.cellClass) return ''
  return typeof col.cellClass === 'function' ? col.cellClass(row) : col.cellClass
}
</script>

<template>
  <div class="dt-wrapper">
    <table class="dt">
      <thead class="dt-head" :class="{ 'dt-head--sticky': stickyHeader }">
        <tr>
          <th
            v-for="col in columns"
            :key="col.key"
            class="dt-th"
            :class="[`dt-th--${col.align ?? 'left'}`, col.headerClass]"
            :style="col.width ? { width: col.width } : {}"
          >
            {{ col.label }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="row in rows"
          :key="rowKey(row)"
          class="dt-row"
        >
          <td
            v-for="col in columns"
            :key="col.key"
            class="dt-td"
            :class="[`dt-td--${col.align ?? 'left'}`, cellClass(col, row)]"
          >
            <slot :name="`cell-${col.key}`" :row="row" :value="row[col.key]">
              {{ row[col.key] }}
            </slot>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.dt-wrapper {
  overflow-x: auto;
  overflow-y: auto;
}

.dt {
  width: 100%;
  border-collapse: collapse;
  font-size: 12px;
  table-layout: fixed;
}

.dt-head--sticky thead,
.dt-head--sticky {
  position: sticky;
  top: 0;
  z-index: 1;
  background-color: var(--color-panel);
}

.dt-th {
  padding: 8px 12px;
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--color-text-muted);
  border-bottom: 1px solid var(--color-border);
  white-space: nowrap;
  background-color: var(--color-panel);
}

.dt-th--left  { text-align: left; }
.dt-th--right { text-align: right; }
.dt-th--center { text-align: center; }

.dt-td {
  padding: 7px 12px;
  color: var(--color-text-secondary);
  border-bottom: 1px solid color-mix(in srgb, var(--color-border) 50%, transparent);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.dt-td--left  { text-align: left; }
.dt-td--right { text-align: right; }
.dt-td--center { text-align: center; }

.dt-row:last-child .dt-td { border-bottom: none; }
.dt-row:hover .dt-td { background-color: var(--color-panel-elevated); }
</style>
