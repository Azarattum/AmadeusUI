<script lang="ts">
  //@ts-nocheck
  import type { ITrack } from "utils/track.interface";
  import { Swiper, SwiperSlide } from "swiper/svelte";
  import { Virtual, Swiper as SwiperRef } from "swiper";
  import "swiper/css";
  import Cover from "components/player/cover.svelte";

  export let queue: ITrack[];
  export let current: ITrack;
  export let paused: boolean;

  $: {
    const index = queue.indexOf(current);
    if (index != swiper?.activeIndex) swiper?.slideTo(index);
  }

  let swiper: SwiperRef | null = null;
</script>

<div>
  <Swiper
    on:swiper={({ detail }) => (swiper = detail[0])}
    on:slideChange={({ detail }) => (current = queue[detail[0][0].activeIndex])}
    modules={[Virtual]}
    virtual={{ slides: queue }}
    initialSlide={queue.indexOf(current)}
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
        <Cover img={track.cover} controls={isActive} bind:paused />
      </SwiperSlide>
    {/each}
  </Swiper>
</div>

<style lang="postcss">
  div :global(.swiper) {
    overflow: visible;
  }
  div :global(.swiper-slide) {
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
  div :global(.swiper-slide-active > *) {
    box-shadow: 0px 4px 28px rgba(0, 0, 0, 0.4);
  }
</style>
