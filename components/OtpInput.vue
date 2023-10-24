<script setup lang="ts">
interface Props {
  length: number
  modelValue: string
  autofocus?: boolean
  type?: 'number' | 'text' | 'password'
  placeholder?: string
  divider?: string
  loading?: boolean
  error?: boolean
}
interface Emits {
  (eventName: 'update:modelValue', value: string): void
  (eventName: 'finish', value: string): void
}

const {
  length = 6,
  type = 'text',
  autofocus = false,
  placeholder = '000000',
  divider = '',
  loading = false,
  error = false,
} = defineProps<Props>()

const emit = defineEmits<Emits>()

const otpModel = defineModel<string>({
  default: '',
})

const focusIndex = ref(-1)
const inputRefList = ref<HTMLInputElement[]>([])

const fields = computed(() => Array<number>(Number(length)).fill(0))
const otpValues = computed(() =>
  otpModel.value ? String(otpModel.value).split('') : []
)
const currentInput = computed(() => inputRefList.value[focusIndex.value])

function getPlaceholderValue() {
  if (typeof placeholder === 'string') {
    if (placeholder.length === length) return placeholder

    if (placeholder.length > 0) {
      console.error(
        'Length of the placeholder should be equal to the number of inputs.'
      )
    }
  }

  return undefined
}

function handleOTPChange(otp: Array<string>) {
  const otpValue = otp.join('')

  otpModel.value = otpValue
}

function changeCodeAtFocus(value: string) {
  const otp = otpValues.value

  otp[focusIndex.value] = value
  handleOTPChange(otp)
}

function focusInputAtIndex(index: number) {
  const activeInputIndex = Math.max(0, Math.min(index, length - 1))

  focusIndex.value = activeInputIndex
}

function handleInput(evt: Event) {
  const value = (evt.target as HTMLInputElement).value

  if (focusIndex.value === length - 1) {
    requestAnimationFrame(() => {
      currentInput.value?.blur()
    })
  }

  changeCodeAtFocus(value)
  focusInputAtIndex(focusIndex.value + 1)
}

function handleFocus(index: number) {
  focusIndex.value = index
}

function handleBlur() {
  focusIndex.value = -1
}

function handleKeyDown(evt: KeyboardEvent) {
  const currentIndex = focusIndex.value
  const lastIndex = length - 1

  if ([evt.code, evt.key].includes('Backspace')) {
    evt.preventDefault()
    changeCodeAtFocus('')
    focusInputAtIndex(focusIndex.value - 1)
  } else if ([evt.code, evt.key].includes('Delete')) {
    evt.preventDefault()
    changeCodeAtFocus('')
  } else if (evt.key === 'ArrowLeft') {
    evt.preventDefault()
    focusIndex.value = currentIndex > 0 ? currentIndex - 1 : lastIndex
  } else if (evt.key === 'ArrowRight') {
    evt.preventDefault()
    focusIndex.value = currentIndex < lastIndex ? currentIndex + 1 : 0
  } else if (['Spacebar', 'Space', 'ArrowUp', 'ArrowDown'].includes(evt.code)) {
    evt.preventDefault()
  }
}

function handlePaste(evt: ClipboardEvent, index: number) {
  evt.preventDefault()
  evt.stopPropagation()

  const pastedData = evt?.clipboardData?.getData('text/plain') || ''
  const otp = pastedData?.slice(0, length).split('')

  handleOTPChange(otp)
  requestAnimationFrame(() => {
    inputRefList.value[index].blur()
  })
}

function addRef(el: unknown) {
  if (el instanceof HTMLInputElement) inputRefList.value.push(el)
}

watch(focusIndex, (val) => {
  if (val < 0) return

  window.requestAnimationFrame(() => {
    currentInput.value?.select()
    currentInput.value?.focus()
  })
})

watch(otpModel, (val) => {
  if (val.length === Number(length)) emit('finish', val)
})
</script>

<template>
  <div
    class="v-otp-input"
    :class="[
      {
        'v-otp-input--divided': divider,
      },
    ]"
  >
    <div class="v-otp-input__content">
      <template v-for="(_, index) in fields" :key="index">
        <span v-if="divider && index !== 0" class="v-otp-input__divider">{{
          divider
        }}</span>
        <input
          :ref="addRef"
          class="v-otp-input__field"
          :aria-label="`Please enter OTP character ${index + 1}`"
          :min="type === 'number' ? 0 : undefined"
          maxlength="1"
          :value="otpValues[index]"
          :autofocus="index === 0 && autofocus"
          :inputmode="type === 'number' ? 'numeric' : 'text'"
          :type="type"
          :placeholder="getPlaceholderValue()?.[index] || undefined"
          @blur="handleBlur"
          @focus="handleFocus(index)"
          @input="handleInput"
          @keydown="handleKeyDown"
          @paste="handlePaste($event, index)"
        />
      </template>
      <div v-if="loading" class="v-overlay">
        <div class="v-overlay__scrim" />
        <div class="v-otp-input__loader v-overlay__content">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
          >
            <path
              fill="currentColor"
              d="M12 2A10 10 0 1 0 22 12A10 10 0 0 0 12 2Zm0 18a8 8 0 1 1 8-8A8 8 0 0 1 12 20Z"
              opacity=".5"
            />
            <path
              fill="currentColor"
              d="M20 12h2A10 10 0 0 0 12 2V4A8 8 0 0 1 20 12Z"
            >
              <animateTransform
                attributeName="transform"
                dur="1s"
                from="0 12 12"
                repeatCount="indefinite"
                to="360 12 12"
                type="rotate"
              />
            </path>
          </svg>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.v-otp-input {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  padding-block: 0.5rem;
  padding-inline: 0;
}

.v-otp-input__divider {
  margin-block: 0;
  margin-inline: 8px;
}

.v-otp-input__content {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: inherit;
  gap: 16px;

  .v-otp-input__divider {
    min-inline-size: 360px;
  }
}

.v-overlay {
  border-radius: inherit;
  display: flex;
  left: 0;
  pointer-events: none;
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
}
.v-overlay__scrim {
  pointer-events: auto;
  background: rgb(255, 255, 255);
  border-radius: inherit;
  bottom: 0;
  left: 0;
  opacity: 0.32;
  position: absolute;
  right: 0;
  top: 0;
}

.v-otp-input__loader {
  display: flex;
  align-items: center;
  justify-content: center;
  block-size: 100%;
  inline-size: 100%;
}
.v-overlay__content {
  outline: none;
  position: absolute;
  pointer-events: auto;
  contain: layout;
}

.v-otp-input__field {
  color: rgb(255, 203, 203);
  width: 3rem;
  height: 3rem;
  font-size: 2rem;
  border-radius: 4px;
  border: 1px solid rgba(0, 0, 0, 0.3);
  text-align: center;

  &[type='number'] {
    appearance: textfield;
  }

  &[type='number']::-webkit-outer-spin-button,
  &[type='number']::-webkit-inner-spin-button {
    margin: 0;
    appearance: none;
  }
}
</style>
