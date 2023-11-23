<script>

    let email = '';
    let password = '';

    function handleLogin () {

    }
</script>

<h1>Login</h1>

<input type="email" id="email-input" placeholder="Email" bind:value={email}>
<input type="password" id="password-input" placeholder="Password" bind:value={password}>
<button on:click={handleLogin}>Submit</button>