<script>
  import { Footer, FooterCopyright } from 'flowbite-svelte';

const currentYear = new Date().getFullYear();
</script>

<Footer class="bottom-0 left-0 w-full " footerType="logo">
  <FooterCopyright href="/" by="ScriptNest™" year={currentYear}/>
</Footer>