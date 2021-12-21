<script lang="ts">
  import { formatTime } from "utils/time";
  import { onDestroy, onMount } from "svelte";

  export let time: number;
  export let length: number;
  export let speedup: number;

  const speed = 5;
  let input: HTMLInputElement;
  let progress: number = 0;
  let locked = false;

  $: handleUpdate(time);
  function handleChange() {
    time = progress;
    locked = false;
  }
  function handleUpdate(value: number) {
    if (!locked && progress !== time) progress = time;
  }
  function handleStart() {
    if (!locked) locked = true;
  }

  function startSeeking(target: EventTarget | null, speed: number) {
    speedup = speed;

    const once = { once: true };
    target?.addEventListener("mouseup", stopSeeking, once);
    target?.addEventListener("mouseleave", stopSeeking, once);
    target?.addEventListener("touchend", stopSeeking, once);
    target?.addEventListener("touchcancel", stopSeeking, once);
  }
  function stopSeeking({ target }: { target: EventTarget | null }) {
    speedup = NaN;
    target?.removeEventListener("mouseup", stopSeeking);
    target?.removeEventListener("mouseleave", stopSeeking);
    target?.removeEventListener("touchend", stopSeeking);
    target?.removeEventListener("touchcancel", stopSeeking);
  }

  onMount(() => {
    input.addEventListener("change", handleChange);
    input.addEventListener("input", handleStart);
  });
  onDestroy(() => {
    input?.removeEventListener("change", handleChange);
    input?.removeEventListener("input", handleStart);
  });
</script>

<div class="playback">
  <input
    aria-label="Playback Progress"
    class="progress"
    type="range"
    min="0"
    max={Number.isFinite(length) ? length : 0}
    style="--progress:{(progress / length) * 100}%"
    bind:value={progress}
    bind:this={input}
    on:touchstart|stopPropagation|passive
  />
  {#key length}
    <div class="time">
      <button
        class="elapsed"
        aria-label="Seek Backwards"
        on:mousedown|nonpassive|stopPropagation|preventDefault={({ target }) =>
          startSeeking(target, -speed)}
        on:touchstart|nonpassive|stopPropagation|preventDefault={({ target }) =>
          startSeeking(target, -speed)}
        oncontextmenu={() => false}
        >{formatTime(Math.min(progress, length))}</button
      >
      <button
        class="left"
        aria-label="Seek Forward"
        on:mousedown|nonpassive|stopPropagation|preventDefault={({ target }) =>
          startSeeking(target, speed)}
        on:touchstart|nonpassive|stopPropagation|preventDefault={({ target }) =>
          startSeeking(target, speed)}
        on:contextmenu={() => false}>{formatTime(length - progress)}</button
      >
    </div>
  {/key}
</div>

<style lang="postcss">
  .playback {
    margin: 8px 24px;

    .progress {
      -webkit-appearance: none;
      position: relative;
      pointer-events: none;
      z-index: 1;
      width: 100%;

      &::-webkit-slider-runnable-track {
        height: 4px;
        border-radius: 4px;
        background: linear-gradient(
              to right,
              var(--color-accent-50),
              var(--color-accent-75)
            )
            0 / var(--progress) 100% no-repeat,
          var(--color-text-caption);
      }

      &::-webkit-slider-thumb {
        -webkit-appearance: none;
        position: relative;
        width: 32px;
        height: 32px;
        margin-top: -14px;
        border: none;
        border-radius: 100%;
        background: radial-gradient(
            circle,
            var(--color-accent-75),
            var(--color-accent-75) 20%,
            transparent 20%,
            transparent 100%
          )
          50% 50%;

        pointer-events: auto;
        transform: translateX(calc(var(--progress) - 50%));
        background-size: 100%;
        transition: background-size 0.3s ease;
      }

      &:active::-webkit-slider-thumb {
        background-size: 500%;
      }
    }
  }
  .time {
    width: 100%;
    display: flex;
    justify-content: space-between;

    * {
      position: relative;
      padding: 4px 16px 10px 16px;
      margin: 0px -16px 0px -16px;

      border-radius: 8px;
      font-size: var(--font-little);
      transition: 0.2s all ease-in-out;

      &:active {
        transition-duration: 0.05s;
        background-color: var(--color-highlight);

        &:before,
        &:after {
          transition-duration: 0.05s;
          opacity: 1;
        }
      }
    }

    *:before,
    *:after {
      opacity: 0;
      transition: opacity 0.2s ease;
    }

    .left:before,
    .elapsed:before {
      position: absolute;
      display: block;
      content: "";
      border: solid currentColor;
      border-width: 0 1px 1px 0;
      border-radius: 1px;
      display: inline-block;
      padding: 2px;
      margin-top: 4px;
    }
    .left:after,
    .elapsed:after {
      display: block;
      content: "";
      width: 100%;
      height: 1px;
      border-radius: 1px;
      margin-top: 3px;
      background-color: currentColor;
    }
    .elapsed:before {
      bottom: 8px;
      left: 16px;
      transform: rotateZ(135deg);
    }
    .left:before {
      bottom: 8px;
      right: 16px;
      transform: rotateZ(-45deg);
    }
  }

  @media (hover: hover) and (pointer: fine) {
    .time *:hover {
      transition-duration: 0.05s;
      background-color: var(--color-highlight);

      &:before,
      &:after {
        transition-duration: 0.05s;
        opacity: 1;
      }
    }

    .playback .progress:hover::-webkit-slider-thumb {
      background-size: 500%;
    }
  }
</style>
