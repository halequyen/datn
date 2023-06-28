<script setup>
</script>

<template>
    <div class="login d-flex">
      <div class="login-left">
        <img class="login-left-logo" src="../assets/images/SkinSyncLogo.png" alt="">
      </div>
      <div class="login-right">
        <h1>
            Chào mừng bạn đến với
        </h1>
        <h1 class="page-name">
            Skin Sync
        </h1>
      </div>
    </div>
  </template>

<style scoped>
.login {
  display: flex;
  justify-content: center;
  align-items: center;
  /* min-height: 100vh;  */
}

.login-left {
  margin: 50px;
}

.login-left-logo {
  width: 300px;

}

.login-right {
  margin-top: 200px;
  font-size: 200%;
  font-weight: 800;
}

.page-name {
    font-size: 350%;
    color: #003ca6;
}
</style>
  