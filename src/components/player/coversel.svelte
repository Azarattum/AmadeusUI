<script lang="ts">
  //@ts-nocheck
  import type { Tracks } from "models/tracks";
  import { tick } from "svelte";
  import "swiper/css";

  import { Virtual, Swiper as SwiperRef } from "swiper";
  import { Swiper, SwiperSlide } from "swiper/svelte";
  import Cover from "components/player/cover.svelte";
  import Options from "./options.svelte";
  import Pause from "./pause.svelte";

  export let tracks: Tracks;
  export let paused: boolean;

  let swiper: SwiperRef | null = null;
  const index = tracks.listened;
  const all = tracks.all;

  all.subscribe(async () => {
    await tick();
    swiper?.virtual.update(true);
  });
  index.subscribe((i) => {
    if (i != swiper?.activeIndex) swiper?.slideTo(i);
  });

  function onChange() {
    if (!swiper) return;
    const { activeIndex, previousIndex } = swiper;
    if (activeIndex > previousIndex) tracks.next();
    else if (activeIndex < previousIndex) tracks.previous();
  }
</script>

<div>
  <Swiper
    on:init={({ detail }) => (swiper = detail[0]?.[0])}
    on:slideChange={onChange}
    modules={[Virtual]}
    virtual={{ slides: $all }}
    initialSlide={$index}
    let:virtualData={{ slides, offset, from }}
    touchMoveStopPropagation
    slideToClickedSlide
  >
    {#each slides as track, index (from + index)}
      <SwiperSlide
        virtualIndex={from + index}
        style={`left: ${offset}px`}
        let:data={{ isActive }}
      >
        <div class="container">
          <Cover image={track.cover} />
          {#if isActive}
            <Pause bind:paused />
            <Options multiartist={track.artists.length > 1} />
          {/if}
        </div>
      </SwiperSlide>
    {/each}
  </Swiper>
</div>

<style lang="postcss">
  .container {
    width: calc(100% - 64px);
    position: relative;
    display: flex;

    margin: 0 32px;
    overflow: hidden;
    border-radius: 16px;

    &:before {
      float: left;
      padding-top: 100%;
      content: "";
    }

    & > :global(*:first-child) {
      position: absolute;
    }
  }
  div :global(.swiper) {
    overflow: visible;
  }
  div :global(.swiper-slide) {
    cursor: pointer;
    transition: 0.3s ease;
    transition-property: transform, opacity;
  }
  div :global(.swiper-slide > *) {
    transition: box-shadow 0.3s ease;
  }
  div :global(.swiper-slide-visible) {
    z-index: -1;
  }
  div :global(.swiper-slide-next) {
    opacity: 0.8;
    transform-origin: left;
    transform: scale(0.8) translateX(-42px);
  }
  div :global(.swiper-slide-prev) {
    opacity: 0.8;
    transform-origin: right;
    transform: scale(0.8) translateX(42px);
  }
  div :global(.swiper-slide-active img) {
    box-shadow: 0px 4px 16px var(--color-shadow);
  }
</style>
