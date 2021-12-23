<script lang="ts">
  import { QuickAction, settings } from "models/settings";
  import { pannable } from "actions/pannable";
  import { slide } from "svelte/transition";
  import { verifyLogin } from "utils/api";
  import jsSHA from "jsSHA";

  import Loader from "./common/loader.svelte";

  export let open = false;
  $: if (open) panel?.click();
  else handle?.click();

  let panel: HTMLElement | undefined;
  let handle: HTMLElement | undefined;
  let password: string | undefined;
  let loading = false;

  async function login() {
    if (!password || !$settings.login || !$settings.hostname) return;
    const hasher = new jsSHA("SHA-1", "TEXT");
    hasher.update(password);
    const hash = hasher.getHash("B64");

    loading = true;
    if (await verifyLogin(hash)) $settings.token = hash;
    else logout();
    loading = false;
  }

  function logout() {
    password = "";
    $settings.token = "";
  }
</script>

<section
  use:pannable={{ gap: 16, handle: ".settings-handle" }}
  bind:this={panel}
  on:open={() => (open = true)}
  on:close={() => (open = false)}
  style="opacity: {+open}"
>
  <div class="settings-handle" bind:this={handle} on:click|stopPropagation />
  <h1>Settings</h1>
  {#if !($settings.hostname && $settings.login && $settings.token)}
    <ul transition:slide>
      <li>
        <input
          type="text"
          name="hostname"
          placeholder="Hostname"
          bind:value={$settings.hostname}
        />
      </li>
      <li>
        <input
          type="text"
          name="login"
          placeholder="Login"
          bind:value={$settings.login}
        />
      </li>
      <li>
        <input
          type="password"
          name="password"
          placeholder="Password"
          bind:value={password}
        />
      </li>
      <li>
        <button on:click={login}>{loading ? "" : "Connect"}</button>
        {#if loading}
          <div class="loader"><Loader size={40} /></div>
        {/if}
      </li>
    </ul>
  {:else}
    <ul transition:slide>
      <li on:click={logout}>
        <span>
          {$settings.login}
          <span class="caption">• {$settings.hostname}</span>
        </span>
      </li>
    </ul>
  {/if}
  <ul>
    <li>
      <label for="select-quick-action">Default Playlist</label>
      <select id="select-quick-action" />
    </li>
    <li>
      <label for="select-quick-action">Quick Action</label>
      <select id="select-quick-action">
        {#each Object.values(QuickAction) as key}
          <option value="key">{key}</option>
        {/each}
      </select>
    </li>
  </ul>
</section>

<style lang="postcss">
  section {
    position: fixed;
    bottom: calc(-1 * var(--view-height) - 16px);
    height: var(--view-height);

    background-color: var(--color-element);
    width: 100%;
    max-width: 100%;
    border-radius: 16px 16px 0 0;
    box-shadow: 0px 0px 8px var(--color-shadow);

    z-index: 2000;
  }
  .settings-handle {
    position: relative;
    left: 50%;
    transform: translateX(-50%);

    margin: 12px 0 8px 0;
    height: 5px;
    width: 35px;
    border-radius: 5px;
    background-color: var(--color-text-caption);

    cursor: pointer;
  }

  ul {
    margin: 0 16px;
    padding: 0;
    border-radius: 8px;
    margin-bottom: 32px;

    & > * {
      background-color: var(--color-background);
      box-shadow: 0 0 2px var(--color-shadow);
      margin-bottom: 1px;
      overflow: hidden;

      transition: background-color 0.3s ease;
      &:active {
        transition-duration: 0.05s;
        background-color: var(--color-highlight);
      }
    }
    & > *:last-child {
      border-bottom-left-radius: 8px;
      border-bottom-right-radius: 8px;
    }
    & > *:first-child {
      border-top-left-radius: 8px;
      border-top-right-radius: 8px;
    }
  }
  li {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-between;

    max-width: 100%;
    height: 44px;

    input {
      text-indent: 16px;
      background-color: transparent;
      width: 100%;
      height: 100%;
    }

    button {
      width: 100%;
      height: 100%;
      text-align: center;
      background-color: var(--color-accent-0);
      color: white;

      transition: background-color 0.3s ease;
      &:active {
        transition-duration: 0.05s;
        background-color: var(--color-accent-75);
      }
    }

    label {
      position: absolute;
      width: max-content;
      white-space: nowrap;
      text-indent: 16px;
      pointer-events: none;
    }

    select {
      width: 100%;
      height: 100%;
      outline: none;
      border: none;
      direction: rtl;
      font-size: var(--font-little);
      color: var(--color-text-caption);
      appearance: none;
      cursor: pointer;
      padding: 0 16px;
    }

    span {
      text-indent: 16px;
    }

    .loader {
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      color: white;
    }
  }

  .caption {
    color: var(--color-text-caption);
    font-size: var(--font-tiny);
  }
</style>
