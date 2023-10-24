<script setup lang="ts">
const otp = ref('')
const loading = ref(false)

const onFinish = (otp: string) => {
  loading.value = true
  setTimeout(() => {
    loading.value = false
    alert(`Your OTP is ${otp}`)
  }, 1000)
}
</script>

<template>
  <OtpInput
    v-model="otp"
    :length="6"
    placeholder="000000"
    class="otp-input"
    :loading="loading"
    @finish="onFinish"
  />
</template>
