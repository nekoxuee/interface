<script lang='ts'>
  import Icon from 'lucide-svelte/dist/Icon.svelte'

  import type { SvelteHTMLElements, SVGAttributes } from 'svelte/elements'

  type Attrs = SVGAttributes<SVGSVGElement>
  const iconNode: Array<[elementName: keyof SvelteHTMLElements, attrs: Attrs]> = [
    ['path', { fill: 'none', d: 'M0 0h24v24H0z' }],
    ['path', { fill: 'currentColor', d: 'M5 4h14a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3zm6 10h-4a1 1 0 0 0 0 2h4a1 1 0 0 0 0-2zm6 0h-2a1 1 0 0 0 0 2h2a1 1 0 0 0 0-2zm-8-4h-2a1 1 0 0 0 0 2h2a1 1 0 0 0 0-2zm8 0h-4a1 1 0 0 0 0 2h4a1 1 0 0 0 0-2z' }]
  ]
</script>

<Icon name='subtitles' {...$$props} {iconNode} viewBox='0 0 24 24' strokeWidth='0'>
  <slot />
</Icon>
