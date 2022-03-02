<template>
  <li class="swpc-list-event">
    <div class="swpc-list-event-date">
      <div class="swpc-list-event-text">
        <div class="swpc-list-event-text-inner">
          <!-- Placeholder for date -->
        </div>
      </div>
    </div>
    <div class="swpc-list-event-description swpc-list-event-description-placeholder">
      <div class="swpc-list-event-description-text swpc-list-event-text">
        <!-- Placeholder for description -->
      </div>
    </div>
  </li>
</template>

<script>
export default {
  name: 'EventItemPlaceholder',
};
</script>

<style lang="scss">
.swpc-list-event-description-placeholder {
  background: var(--clouded-sky);
  background: linear-gradient(90deg, var(--silver) 0%, var(--clouded-sky) 100%);
  background-size: 600% 600%;

  animation: LoadingBackgroundAnimation 4s ease infinite;

  min-width: 420px;
}

@keyframes LoadingBackgroundAnimation {
  0%{background-position:0% 50%}
  50%{background-position:100% 50%}
  100%{background-position:0% 50%}
}
</style>
