<script>
  import { Footer, FooterCopyright } from "flowbite-svelte";

  const currentYear = new Date().getFullYear();
</script>

<Footer class="bottom-0 left-0 w-full " footerType="logo">
  <hr class="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
  <FooterCopyright href="/" by="ScriptNest™" year={currentYear} />
</Footer>
