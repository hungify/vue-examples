<script lang="ts" setup>
const tips = [
  `Don't upload %{"type":"link","text":"prohibited","url":"$storeUrl/university/article?knowledge_id=10008100"} or %{"type":"link","text":"restricted","url":"$storeUrl/university/article?knowledge_id=10008106"} products.`,
  'Miscategorisation may be subject to violation enforcement such as product removal in serious cases.',
  'Some categories that cannot be selected are invite-only categories. To apply, please email your (i) seller name, (ii) requested category, and (iii) shop code to %{"type": "copy","text":"category-application-uk@tiktok.com"}',
  `Please click here for more details: Invite Only Application: %{"type":"link","text": "Application Form.","url":"$storeUrl/university/essay?knowledge_id=10013148&role=1&course_type=1&identity=1"}`,
  'Please complete the %{"type":"brandAuth","text":"Brand Authorization"} if your product has brand qualification. Products with brand authorization are more likely to get more recommendation opportunities on the platform.',
]

const toast = useToast()

const getHints = (tips: string[]) => {
  return (tips || []).map((text) =>
    text
      .split(/(%{.*?})/)
      .map((item) =>
        item.match(/%{.*?}/) ? JSON.parse(item.replace(/%/, '')) : item.trim()
      )
  )
}

const handleCopy = (_text: string) => {
  toast.add({ title: 'Copied!' })
}

const currentUrl = (url: string) =>
  url.replaceAll('$storeUrl', 'https://www.tiktok.com')
</script>

<template>
  <ul class="list-none gap-2 flex flex-col">
    <li v-for="(hints, index) in getHints(tips)" :key="index">
      <span v-for="(item, i) in hints" :key="i">
        <template v-if="item && item.type === 'link'">
          <ULink
            :to="currentUrl(item.url)"
            inactive-class="mx-1 text-primary hover:text-primary-500"
          >
            {{ item.text }}
          </ULink>
        </template>
        <template v-else-if="item && item.type === 'copy'">
          <UButton
            class="mx-1"
            @click="handleCopy(item.text)"
            :label="item.text"
          />
        </template>
        <template v-else-if="item && item.type === 'brandAuth'">
          <UTooltip text="Tooltip Message">
            <UButton color="gray" class="mx-1">
              {{ item.text }}
            </UButton>
          </UTooltip>
        </template>
        <template v-else>
          {{ item }}
        </template>
      </span>
    </li>
  </ul>
</template>
