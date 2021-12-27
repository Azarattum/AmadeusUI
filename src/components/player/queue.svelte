<script lang="ts">
  import type { Track as TrackData } from "models/tracks";
  import tracks, { Repeatition, Diretion } from "models/tracks";
  import { scroller } from "actions/scroller";
  import draggable from "actions/draggable";
  import tappable from "actions/tappable";
  import { fly } from "svelte/transition";

  import VirtualList from "components/common/virtuallist.svelte";
  import Miniplayer from "./miniplayer.svelte";
  import Track from "components/track.svelte";
  import { onDestroy, tick } from "svelte";

  export let paused: boolean;
  export let loading: boolean;
  export let time: number;

  const itemHeight = 57;
  let showHistory = false;
  let viewport: HTMLElement;
  let swapping = false;
  let queueFlipping = 0;
  let historyFlipping = 0;
  let queueContainer: HTMLElement;
  let historyContainer: HTMLElement;

  let infinity = false;
  let history: TrackData[] = [];
  let queue: TrackData[] = [];

  const unsubscribe = tracks.subscribe(async () => {
    if (!swapping) {
      queueFlipping++;
      historyFlipping++;
      await tick();
    }
    queue = tracks.queue;
    history = tracks.history.slice().reverse();
    swapping = false;
  });

  $: {
    showHistory;
    viewport?.scrollTo(0, 0);
  }

  function onSwap({ detail }: SwapEvent) {
    const { from, to } = detail;
    swapping = true;
    tracks.rearrange(from, to);
  }

  onDestroy(unsubscribe);
</script>

<div class="container">
  <Miniplayer {loading} bind:paused bind:time />
  <div class="toolbar">
    <button
      class="history"
      aria-label="Toggle History"
      on:click={() => (showHistory = !showHistory)}
      class:enabled={showHistory}
    />
    <div>
      {#if showHistory}
        <h2 in:fly={{ x: -32, delay: 300 }} out:fly={{ x: -32, duration: 300 }}>
          History
        </h2>
      {:else}
        <h2 in:fly={{ x: -32, delay: 300 }} out:fly={{ x: -32, duration: 300 }}>
          Queue
        </h2>
      {/if}
    </div>

    {#if showHistory}
      <button
        class="clear"
        aria-label="Clear History"
        on:click={() => tracks.clearHistory()}
      />
    {:else}
      <button
        class="infinity"
        aria-label="Toggle Infinite Play"
        class:enabled={infinity}
        on:click={() => (infinity = !infinity)}
      />
      <button
        class="direction"
        aria-label="Switch Playback Direction"
        class:normal={$tracks.direction == Diretion.Normal}
        class:backwards={$tracks.direction == Diretion.Backwards}
        class:shuffled={$tracks.direction == Diretion.Shuffled}
        on:click={() => tracks.direct((tracks.direction + 1) % 3)}
      />
      <button
        class="repeat"
        aria-label="Switch Repeat Mode"
        class:none={$tracks.repeatition == Repeatition.None}
        class:all={$tracks.repeatition == Repeatition.All}
        class:single={$tracks.repeatition == Repeatition.Single}
        class:enabled={$tracks.repeatition}
        on:click={() => tracks.repeat((tracks.repeatition + 1) % 3)}
      />
    {/if}
  </div>
  <div
    use:scroller={{ header: ".toolbar>div", hider: ".slider-handle" }}
    bind:this={viewport}
    class="viewport"
  >
    {#if showHistory}
      <div transition:fly={{ y: -itemHeight }} bind:this={historyContainer}>
        <VirtualList
          items={history}
          container={historyContainer}
          {itemHeight}
          {viewport}
          bind:flipping={historyFlipping}
          let:item={track}
        >
          <div
            use:tappable
            class="track"
            class:tapped={false}
            on:click={() => tracks.play({ ...track })}
          >
            <Track {track} extra="duration" />
          </div>
        </VirtualList>
      </div>
    {:else}
      <div
        use:draggable={{ offsetTop: 16, margin: 1 }}
        transition:fly={{ y: itemHeight }}
        bind:this={queueContainer}
        on:swap={onSwap}
      >
        <VirtualList
          items={queue}
          container={queueContainer}
          {itemHeight}
          {viewport}
          bind:flipping={queueFlipping}
          let:item={track}
          let:index
        >
          <div
            use:tappable
            class="track"
            class:tapped={false}
            on:click={() => tracks.play(track)}
            class:dragging={false}
            data-index={index}
          >
            <Track {track} extra="duration" />
          </div>
        </VirtualList>
      </div>
    {/if}
    <div
      class="slider-handle"
      style="display: none;"
      aria-label="Close Queue"
    />
  </div>
</div>

<style lang="postcss">
  @import "../../styles/mixins.pcss";
  h2 {
    font-size: var(--font-large);
    margin-block-start: 0.67em;
    margin-block-end: 0.67em;
  }
  .container {
    display: flex;
    flex-direction: column;
    height: calc(100% + 16px);
    margin: 32px 0px 0 0px;

    & :global(.miniplayer) {
      z-index: 1;
      flex-shrink: 0;
      background: var(--color-element);
      border-radius: 4px;
      box-shadow: 0px 0px 4px var(--color-shadow);

      margin: 4px;
      width: calc(100% - 8px);
    }
  }

  .toolbar {
    display: flex;
    align-items: baseline;
    min-height: 71px;
    max-height: 71px;
    z-index: 2;
    background: linear-gradient(
      180deg,
      var(--color-element) calc(100% - 8px),
      var(--color-element-transparent)
    );
    margin-bottom: -8px;

    * {
      margin: 8px 4px;
    }
    .history {
      &:before {
        icon: history 24px;
        transition: transform 0.5s ease;
      }

      &.enabled:before {
        transform: rotate(-360deg);
      }
    }

    & > div {
      margin-left: 0;
      width: 100%;
      z-index: -1;
    }

    .clear:before {
      icon: clear 24px;
      animation: fade-in 0.3s 1;
    }

    .infinity:before {
      icon: infinity 24px;
      animation: fade-in 0.3s 1;
    }

    .direction.normal:before {
      icon: forward 24px;
      animation: fade-in 0.3s 1;
    }
    .direction.backwards:before {
      icon: backwards 24px;
      animation: fade-in 0.3s 1;
    }
    .direction.shuffled:before {
      icon: shuffle 24px;
      animation: fade-in 0.3s;
    }

    .repeat.none:before,
    .repeat.all:before {
      icon: repeat 24px;
      animation: fade-in 0.3s;
    }
    .repeat.single:before {
      icon: repeat-one 24px;
      animation: fade-in 0.3s;
    }

    .direction:active:before,
    .repeat:active:before {
      animation: none;
    }

    button {
      padding: 8px;
      border-radius: 4px;
      background-color: var(--color-highlight);

      transition: 0.3s ease;
      transition-property: background-color, color;
      &:active {
        transition-duration: 0.05s;
        background-color: var(--color-highlight-active);
      }

      &.enabled {
        color: white;
        transition-duration: 0.3s;
        background-color: var(--color-accent-0);
      }
    }
  }

  .viewport {
    height: 100%;
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    overflow: hidden scroll;

    & > div {
      grid-row: 1;
      grid-column: 1;
    }

    .track {
      -webkit-user-drag: element;

      background: var(--color-element);
      width: calc(100% - 8px);
      box-shadow: 0 0 2px var(--color-shadow);
      margin-bottom: 1px;
      padding: 4px;
      cursor: pointer;

      transition: box-shadow 0.3s ease, border-radius 0.3s ease,
        transform 0.3s ease;

      &.dragging {
        transition: box-shadow 0.3s ease, border-radius 0.3s ease;
        position: relative;
        box-shadow: 0 0 16px var(--color-shadow);
        border-radius: 8px;
        z-index: 1;
      }
      &.tapped {
        background-color: var(--color-highlight);
      }

      :global(*) {
        pointer-events: none;
      }
    }
  }

  @keyframes fade-in {
    0% {
      opacity: 0;
      transform: scale(0);
    }
    100% {
      opacity: 1;
      transform: scale(1);
    }
  }
</style>
