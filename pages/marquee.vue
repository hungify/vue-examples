<script setup lang="ts"></script>

<template>
  <Marquee direction="horizontal" duration="10s">
    <li>1</li>
    <li>2</li>
    <li>3</li>
  </Marquee>
  <br />
  <br />

  <Marquee direction="horizontal" fit-content duration="10s">
    <li>1</li>
    <li>2</li>
    <li>3</li>
  </Marquee>

  <br />
  <br />

  <Marquee direction="vertical" duration="10s">
    <li>1</li>
    <li>2</li>
    <li>3</li>
  </Marquee>

  <br />
  <br />
  <div>
    <Marquee direction="vertical" fit-content duration="10s" reverse>
      <li>1</li>
      <li>2</li>
      <li>3</li>
    </Marquee>
  </div>
</template>

<style scoped>
li {
  flex: 0 0 auto;
  color: white;
  background: dodgerblue;
  margin: 2px;
  padding: 1rem 2rem;
  border-radius: 0.25rem;
  text-align: center;
}

.marquee {
  border: 2px dashed lightgray;
}
</style>
