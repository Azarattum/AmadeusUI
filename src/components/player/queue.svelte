<script lang="ts">
  import VirtualList from "components/virtuallist.svelte";
  import type { ITrack } from "utils/track.interface";
  import Miniplayer from "./miniplayer.svelte";
  import Track from "components/track.svelte";
  import { scroller } from "actions/scroller";
  import draggable from "actions/dragable";
  import { fly } from "svelte/transition";

  enum Diretion {
    Normal,
    Backwards,
    Shuffled,
  }
  enum Repeat {
    None,
    All,
    Single,
  }

  export let time: number;
  export let paused: boolean;
  export let current: ITrack;
  export let queue: ITrack[];

  let history = false;
  let infinity = false;
  let repeat = Repeat.None;
  let direction = Diretion.Normal;

  let container: HTMLElement;
  function onSwap({ detail }: SwapEvent) {
    const { from, to } = detail;
    const index = queue.indexOf(current) + 1;
    const item = queue.splice(index + from, 1)[0];
    queue.splice(index + to, 0, item);
    queue = queue;
  }
</script>

<div class="container">
  <Miniplayer bind:current bind:paused bind:time />
  <div class="toolbar">
    <button
      class="history"
      aria-label="Toggle History"
      on:click={() => (history = !history)}
      class:enabled={history}
    />
    <div>
      {#if !history}
        <h1 in:fly={{ x: -32, delay: 300 }} out:fly={{ x: -32, duration: 300 }}>
          Queue
        </h1>
      {:else}
        <h1 in:fly={{ x: -32, delay: 300 }} out:fly={{ x: -32, duration: 300 }}>
          History
        </h1>
      {/if}
    </div>

    <button
      class="infinity"
      aria-label="Toggle Infinite Play"
      class:enabled={infinity}
      on:click={() => (infinity = !infinity)}
    />
    <button
      class="direction"
      aria-label="Switch Playback Direction"
      class:normal={direction == Diretion.Normal}
      class:backwards={direction == Diretion.Backwards}
      class:shuffled={direction == Diretion.Shuffled}
      on:click={() => (direction = (direction + 1) % 3)}
    />
    <button
      class="repeat"
      aria-label="Switch Repeat Mode"
      class:none={repeat == Repeat.None}
      class:all={repeat == Repeat.All}
      class:single={repeat == Repeat.Single}
      class:enabled={repeat}
      on:click={() => (repeat = (repeat + 1) % 3)}
    />
  </div>
  <div
    bind:this={container}
    class="queue"
    use:scroller={{ header: ".toolbar>div", hider: ".handle-slider" }}
  >
    {#if !history}
      <div transition:fly={{ y: 48 }}>
        <VirtualList
          items={queue.slice(queue.indexOf(current) + 1)}
          itemHeight={57}
          {container}
          let:item={track}
          let:index
        >
          <div
            class="track"
            use:draggable={{ container, index }}
            class:dragging={false}
            on:swap={onSwap}
          >
            <Track {track} extra="duration" />
          </div>
        </VirtualList>
      </div>
    {:else}
      <div transition:fly={{ y: -48 }}>
        <VirtualList
          items={queue.slice(0, queue.indexOf(current))}
          itemHeight={57}
          {container}
          let:item
        >
          <div class="track">
            <Track
              track={item}
              extra="duration"
              on:click={() => (current = item)}
            />
          </div>
        </VirtualList>
      </div>
    {/if}
    <div
      class="handle-slider"
      style="display: none;"
      aria-label="Close Queue"
    />
  </div>
</div>

<style lang="postcss">
  @import "../../styles/mixins.pcss";
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

    .infinity:before {
      icon: infinity 24px;
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

  .queue {
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

      width: calc(100% - 8px);
      box-shadow: 0 0 2px var(--color-shadow);
      margin-bottom: 1px;
      padding: 4px;

      &.dragging {
        transition: 0.3s ease;
        transition-property: box-shadow, border-radius;

        position: relative;
        background: var(--color-element);
        box-shadow: 0 0 16px var(--color-shadow);
        border-radius: 8px;
        z-index: 1;
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
