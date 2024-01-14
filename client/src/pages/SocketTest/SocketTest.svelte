<script>
  import ColorList from "./ColorList.svelte";
  import { colorList } from "./colorStore.js";
  import { userStore } from "../../store/userStore.js";
  import { Button } from "flowbite-svelte";


  import io from "socket.io-client";
  const socket = io("localhost:3000");

  let color;
  let bgColor;
  let pickerName;

  function chooseColor() {
    socket.emit("client-choose-a-color", {
      data: color,
      name: $userStore.user.displayName,
    });
  }

  socket.on("server-sent-a-color", (data) => {
    console.log("Received data:", data);
    bgColor = data.data;
    pickerName = data.name;
    console.log("pickername:", pickerName);
    colorList.update((colors) => {
      colors.push({ color: bgColor, name: pickerName });
      return colors;
    });
  });
</script>

<svelte:body style:background-color={bgColor}/>
<input type="color" bind:value={color}/>
<Button on:click={chooseColor}>Choose</Button>

<ColorList></ColorList>
