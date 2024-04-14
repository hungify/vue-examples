<script setup lang="ts">
const options = [
  { id: 1, name: 'Color' },
  { id: 2, name: 'Size' },
  { id: 3, name: 'Material' },
]

interface OptionName {
  id: number
  name: string
  mode: 'edit' | 'view'
}
interface OptionValue {
  parentOptionId: number
  id: number
  value: string
}

const optionNames = ref<OptionName[]>([
  {
    id: 1,
    name: 'Color',
    mode: 'edit',
  },
])
const optionValues = ref<OptionValue[]>([
  {
    parentOptionId: 1,
    id: 1,
    value: '',
  },
])

const addAnotherOption = () => {
  const newOptionId = optionNames.value.length + 1
  optionNames.value.push({
    id: newOptionId,
    name: '',
    mode: 'edit',
  })
  optionValues.value.push({
    parentOptionId: newOptionId,
    id: 1,
    value: '',
  })
}

const optionValuesChange = (
  optionId: number,
  valueId: number,
  event: Event
) => {
  const index = optionValues.value.findIndex(
    (value) => value.parentOptionId === optionId && value.id === valueId
  )
  optionValues.value[index].value = (event.target as HTMLInputElement).value

  // Add another option value if the last option value is being edited
  if (index === optionValues.value.length - 1) {
    optionValues.value.push({
      parentOptionId: optionNames.value.length,
      id: optionValues.value.length + 1,
      value: '',
    })
  }
}

const doneOptionValues = (parentOptionId: number) => {
  // Remove the last option value if it's empty
  if (optionValues.value[optionValues.value.length - 1].value === '') {
    optionValues.value.pop()
  }

  // Change the mode of the last option name to view
  const index = optionNames.value.findIndex(
    (option) => option.id === parentOptionId
  )
  optionNames.value[index].mode = 'view'
}

const optionAction = (id: number) => {
  const index = optionNames.value.findIndex((option) => option.id === id)
  optionNames.value[index].mode =
    optionNames.value[index].mode === 'edit' ? 'view' : 'edit'

  // view mode: remove all option values and add a new one
  if (optionNames.value[index].mode === 'view') {
    optionValues.value = optionValues.value.filter(
      (value) => value.parentOptionId !== id
    )
    optionValues.value.push({
      parentOptionId: id,
      id: 1,
      value: '',
    })
  }
}

const valueByParentOptionId = (optionId: number, valueId: number) => {
  const value = optionValues.value.findIndex(
    (value) => value.parentOptionId === optionId && value.id === valueId
  )
  return value === -1 ? '' : optionValues.value[value].value
}

const optionValuesByParentOptionId = (optionId: number) => {
  return optionValues.value.filter((value) => value.parentOptionId === optionId)
}

const skus = computed(() => {
  return cartesianProduct(
    optionNames.value.map((option) =>
      optionValues.value
        .filter((value) => value.parentOptionId === option.id)
        .map((value) => ({
          [option.name]: value.value,
        }))
    )
  )
})
</script>

<template>
  <section>
    <h2>Variants</h2>
    <form @submit.prevent>
      <ul class="max-w-[300px]">
        <li v-for="option in optionNames" :key="option.id">
          <label class="flex flex-col">
            <span>Option name</span>
            <div class="flex gap-4">
              <select
                name="option"
                @change="
                  option.name = ($event.target as HTMLSelectElement).value
                "
              >
                <option :value="option.name" disabled>{{ option.name }}</option>
                <option
                  v-for="option in options"
                  :key="option.id"
                  :value="option.name"
                >
                  {{ option.name }}
                </option>
              </select>
              <button @click="optionAction(option.id)">
                {{ option.mode === 'edit' ? 'Delete' : 'Edit' }}
              </button>
            </div>
          </label>
          <div class="border border-solid border-white mt-2" />
          <ul class="mt-2" v-if="option.mode === 'edit'">
            <li
              v-for="value in optionValuesByParentOptionId(option.id)"
              :key="value.id"
            >
              <label class="flex flex-col">
                <span>Option values</span>
                <input
                  type="text"
                  :name="`option-value-${value.id}`"
                  :value="valueByParentOptionId(option.id, value.id)"
                  @input="optionValuesChange(option.id, value.id, $event)"
                />
              </label>
            </li>
            <button @click="doneOptionValues(option.id)">Done</button>
          </ul>
        </li>
      </ul>
      <button @click="addAnotherOption">Add another option</button>
    </form>

    <span>Group by</span>
    {{ skus }}
    <table>
      <thead>
        <tr>
          <th v-for="option in optionNames" :key="option.id">
            {{ option.name }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(sku, index) in skus" :key="index">
          <td v-for="option in optionNames" :key="option.id">
            {{ sku[option.name] }}
          </td>
        </tr>
      </tbody>
    </table>
  </section>
</template>
