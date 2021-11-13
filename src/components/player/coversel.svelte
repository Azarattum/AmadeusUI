<script lang="ts">
  //@ts-nocheck
  import { Repeatition, Tracks, Track } from "models/tracks";
  import "swiper/css";

  import { Virtual, Swiper as SwiperRef } from "swiper";
  import { Swiper, SwiperSlide } from "swiper/svelte";
  import Cover from "components/player/cover.svelte";
  import Options from "./options.svelte";
  import Pause from "./pause.svelte";

  export let tracks: Tracks;
  export let paused: boolean;

  let manual = false;
  let swiper: SwiperRef | null = null;

  $: if (swiper && $tracks) {
    const view = [];
    const slides = swiper.virtual.slides;
    view[0] = tracks.history[tracks.history.length - 2] || null;
    view[1] = tracks.history[tracks.history.length - 1] || null;
    view[2] = tracks.current;
    view[3] = tracks.queue[0];
    view[4] = tracks.queue[1];
    if (tracks.repeatition == Repeatition.All) {
      if (!view[3]) view[3] = tracks.history[0];
      if (!view[4]) view[4] = tracks.history[1];
    }

    const active = slides[swiper.activeIndex];
    if (!view.includes(active) || !active) {
      swiper.virtual.slides = view.filter(Boolean);
      swiper.activeIndex = slides.indexOf(tracks.current);
      swiper.update();
    } else {
      const slideIndex = swiper.activeIndex;
      const viewIndex = view.indexOf(active);

      for (let i = -4; i < 6; i++) {
        if (!i) continue;
        if (slides[slideIndex + i] != view[viewIndex + i]) {
          if ([slideIndex + i]) {
            slides[slideIndex + i] = view[viewIndex + i];
          } else {
            if (i < 0) {
              swiper.virtual.prependSlide(view[viewIndex + i] as any);
            } else {
              swiper.virtual.appendSlide(view[viewIndex + i] as any);
            }
          }
        }
      }

      swiper.virtual.update(true);
      if (active != tracks.current) {
        manual = true;
        swiper.slideTo(swiper.virtual.slides.indexOf(tracks.current), 300);
      }
    }
  }

  function onChange() {
    if (!swiper) return;
    if (manual) {
      manual = false;
      return;
    }
    const { activeIndex, previousIndex } = swiper;

    if (previousIndex == -1) return;
    if (activeIndex > previousIndex) tracks.next();
    else if (activeIndex < previousIndex) tracks.previous();
  }
</script>

<div>
  <Swiper
    on:init={({ detail }) => (swiper = detail[0]?.[0])}
    on:slideChange={onChange}
    modules={[Virtual]}
    virtual={{ slides: [] }}
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
        {#if track}
          <div class="container">
            <Cover image={track.cover} />
            {#if isActive}
              <Pause bind:paused />
              <Options multiartist={track.artists.length > 1} />
            {/if}
          </div>
        {/if}
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
