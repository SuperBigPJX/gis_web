<script>
import {removeCookie} from "@/utils/cookie_utils.js";
import router from "@/router/index.js";
import {TOKEN_NAME} from "@/config/global.js";

export default {
  name: "AfterLogin",
  methods: {
    logout() {
      removeCookie(TOKEN_NAME)
      router.push("/login")
    }
  }
}
</script>

<template>
  <div class="page">
    <div class="compliment">
      <span>Congratulation!</span>
    </div>
    <button class="btn" @click="logout">返回登录页面</button>
  </div>
</template>

<style scoped lang="scss">
.page {
  display: flex;
  justify-content: center;
  align-content: center;
  flex-direction: column;

  .compliment {
    display: flex;
    justify-content: center;
    align-content: center;

    font-size: large;
  }

  .btn {
    position: absolute;
    font-size: medium;
    width: 30%;
    background: blanchedalmond;
    left: 520px;
    top: 100px
  }
}

</style>