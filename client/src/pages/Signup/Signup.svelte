<script>

    let email = '';
    let password = '';
    let rePassword= '';

    function passwordCheck (){
        if (password === rePassword) {
            return
        } else {
            alert("Password don't match")
        }
    }

    function handleSignup () {

    }
</script>

<h1>Signup</h1>
<div>
    <input type="email" id="email-input" placeholder="Email" bind:value={email}>
</div>
<div>
    <input type="password" id="password-input" placeholder="Password" bind:value={password}>
</div>
<div>
    <input type="password" id="password-input" placeholder="Re-Password" bind:value={rePassword}>
</div>
<div>
    <button type="submit" on:click={handleSignup}>Register</button>
</div>

