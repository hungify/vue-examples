<script setup lang="ts">
interface Props {
  pauseOnHover?: boolean
  pauseOnClick?: boolean
  reverse?: boolean
  direction?: 'vertical' | 'horizontal'
  duration?: string
  fitContent?: boolean
  posAbsolute?: boolean
  loop?: boolean
}

withDefaults(defineProps<Props>(), {
  direction: 'horizontal',
  reverse: false,
  pauseOnHover: false,
  duration: '30s',
  pauseOnClick: false,
  loop: true,
})
</script>

<template>
  <div
    class="marquee"
    :class="[
      {
        'marquee--reverse': reverse,
        'marquee--hover-pause': pauseOnHover,
        'marquee--vertical': direction === 'vertical',
        'marquee--fit-content': fitContent,
        'marquee--pos-absolute': posAbsolute,
        'marquee--click-pause': pauseOnClick,
        'marquee--loop': loop,
      },
    ]"
  >
    <ul class="marquee__group">
      <slot />
    </ul>

    <ul class="marquee__group" aria-hidden="true">
      <slot />
    </ul>
  </div>
</template>

<style scoped>
.marquee {
  position: relative;
  display: flex;
  flex-direction: row;
  overflow: hidden;
  user-select: none;
  gap: var(--gap);
}

.marquee__group {
  flex-shrink: 0;
  display: flex;
  justify-content: space-around;
  gap: var(--gap);
  min-width: 100%;
  list-style-type: none;
  padding: 0;
  margin: 0;
  animation-name: scroll-x;
  animation-duration: v-bind(duration);
  animation-timing-function: linear;
}

.marquee--loop .marquee__group {
  animation-iteration-count: infinite;
}

.marquee--reverse .marquee__group {
  animation-direction: reverse;
  animation-delay: -3s;
}

.marquee--vertical {
  height: 100ch;
}

.marquee--vertical .marquee__group {
  min-height: 100%;
}

.marquee--vertical,
.marquee--vertical .marquee,
.marquee--vertical .marquee__group {
  flex-direction: column;
}

.marquee--vertical .marquee__group {
  animation-name: scroll-y;
}

.marquee--hover-pause:hover *,
.marquee--click-pause:active * {
  animation-play-state: paused;
}

.marquee--fit-content {
  max-width: fit-content;
}

.marquee--vertical.marquee--fit-content {
  height: 50ch;
}

.marquee--pos-absolute .marquee__group:last-child {
  position: absolute;
  top: 0;
  left: 0;
}

.marquee--pos-absolute .marquee__group:last-child {
  animation-name: scroll-abs-x;
}

.marquee--vertical.marquee--pos-absolute .marquee__group:last-child {
  animation-name: scroll-abs-y;
}

@media (prefers-reduced-motion: reduce) {
  .marquee__group {
    animation-play-state: paused !important;
  }
}

@keyframes scroll-x {
  from {
    transform: translateX(var(--scroll-start));
  }

  to {
    transform: translateX(var(--scroll-end));
  }
}

@keyframes scroll-y {
  from {
    transform: translateY(var(--scroll-start));
  }

  to {
    transform: translateY(var(--scroll-end));
  }
}

@keyframes scroll-abs-x {
  from {
    transform: translateX(calc(100% + var(--gap)));
  }

  to {
    transform: translateX(0);
  }
}

@keyframes scroll-abs-y {
  from {
    transform: translateY(calc(100% + var(--gap)));
  }

  to {
    transform: translateY(0);
  }
}
</style>

<style>
:root {
  --color-text: navy;
  --color-bg: papayawhip;
  --color-bg-accent: #ecdcc0;
  --size: clamp(10rem, 1rem + 40vmin, 30rem);
  --gap: calc(var(--size) / 14);
  --scroll-start: 0;
  --scroll-end: calc(-100% - var(--gap));
}
</style>
