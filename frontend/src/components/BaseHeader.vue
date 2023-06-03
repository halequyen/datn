<script setup></script>

<template>
  <header class="header">
    <ul>
      <div class="aside-left-logo">
      <img class="aside-left-logo-image" src="../assets/images/SkinSyncLogo.png" alt="" style="width: 50px;">
      <span class="aside-left-logo-text">SKINSYNC</span>
    </div>
    </ul>
    <ul class="login">
      <li><b>Admin</b></li>
      <li>
        <el-dropdown trigger="click">
        <span class="el-dropdown-link">
          <font-awesome-icon class="font-awesome-icon" icon="fa-solid fa-gear" /><el-icon class="el-icon--right"><arrow-down /></el-icon>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item>Đổi mật khẩu</el-dropdown-item>
            <el-dropdown-item>Đăng xuất</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
      </li>
    </ul>
  </header>
</template>

<style scoped>
header {
  display: flex;
  justify-content: space-between;
  margin-top: 30px;
}

header ul {
  list-style: none;
}

.aside-left-logo {
  position: absolute;
  left: 15px;
  top: 20px;
}

.aside-left-logo-image {
  width: 50px;
}

.aside-left-logo-text {
  font-weight: 700;
  font-size: 150%;
  margin-bottom: 100px;
}

.header-title {

  font-size: 150%;
}

.login {
  display: flex;
  margin-right: 50px;
}

.login li {
  margin-right: 25px;
}

.login b {
  color: #606266;
  font-size: 120%;
}

.login .font-awesome-icon {
  margin-top: 3px;
  font-size: 120%;
}

.login .font-awesome-icon:hover {
  color: black;
}
</style>
