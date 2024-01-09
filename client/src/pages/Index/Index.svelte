<script>
  import "../../styles/global.css";
  import "./index.css";
  import homePageImage from "../../assets/indexAssets/indexMainImage.png";
  import { Button } from 'flowbite-svelte';

</script>

<main class="global-font md:grid grid-cols-2 gap-4 p-4 flex flex-col">
  <div class="index-header-style">
    <div class="page-header">
      <h1>Script ideas organized simpler!</h1>
    </div>
    <div class="index-description-style">
      <h2>
        Create clear, structured script concepts, share with others, and comment
        others' ideas while maintaining them in an organized way.
      </h2>
    </div>
    <div>
      <Button  href="/auth/signup">
        <span class=""><b>Sign up, now!</b> It’s free</span></Button>
    </div>
  </div>
  <div class="flex justify-center items-center my-8">
    <img src={homePageImage} alt="" class="max-h-[42rem]" />
  </div>
</main>
