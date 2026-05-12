<script lang='ts'>
  import Recommendation from '../cards/recommendation.svelte'

  import { client } from '$lib/modules/anilist'

  export let mediaId: number

  $: query = client.recommendations(mediaId)
</script>

<div class='pointer-events-auto grid justify-center grid-cols-[repeat(auto-fill,minmax(184px,max-content))]'>
  <Recommendation {query} />
</div>
