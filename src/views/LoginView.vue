<template>
  <div class="page">
    <!--  <div class="bg-box">-->
    <!--    <img class="bg-img" src="@/assets/bg.png" alt="">-->
    <!--  </div>-->
    <div class="left">
      <img class="img-left" src="@/assets/bluegirl.jpg" alt=""/>
    </div>

    <div class="right">
      <div class="login_page">

        <div class="login_title">
          <span>登录</span>
        </div>
        <div class="login_item">
          <div class="common-label">
            <UserCircleIcon/>
            用户名:
          </div>
          <div class="account-input">
            <input class="form-input" v-model="form.account" placeholder="请输入用户名">
          </div>

          <div class="common-label">
            <LockOnIcon/>
            密码:
          </div>
          <div class="account-input">
            <input class="form-input" v-model="form.password" placeholder="请输入密码">
          </div>

          <div class="verification_item">
            <div class="common-label">
              <UnfoldMoreIcon/>
              验证码:
            </div>
            <div class="verification2_input">
              <input class="verification_input" v-model="form.verification" placeholder="请输入验证码">
              <div class="verification_box">
                <img class="verification_img" @click="getCaptcha" :src="verification_img" alt="">
              </div>
            </div>
          </div>
          <div class="btnrow">
            <button class="b-login b-share" @click="submit">登录</button>
<!--            <button class="b-rig b-share">注册</button>-->
          </div>

        </div>
      </div>
    </div>
  </div>
</template>
<script>
import axios from "axios";
import {setCookie} from "@/utils/cookie_utils.js";
import {TOKEN_NAME} from "@/config/global.js";
import router from "@/router/index.js";
import afterLogin from "@/views/AfterLogin.vue";
import {LockOnIcon, UnfoldMoreIcon, UserCircleIcon} from "tdesign-icons-vue-next";


export default {
  name: "LoginView",
  components: {UnfoldMoreIcon, LockOnIcon, UserCircleIcon},
  data() {
    return {
      form: {
        account: null,
        password: null,
        verification: null,
      },
      verification_img: null,
    }
  },
  created() {
    console.log("111111")
    console.debug("222222222")
    console.error("3333333")
  },
  mounted() {
    this.getCaptcha()

  },
  methods: {
    getCaptcha() {
      let that = this
      axios.get(
          "http://127.0.0.1:8199/api/user/getCaptchaImage"
      ).then(res => {
            console.log(res)
            that.verification_img = res.data.data
          }
      )
    },
    submit() {
      let account = this.form.account
      let password = this.form.password
      let verification = this.form.verification
      // let verification_img = this.form.verification_img
      if (account === null || account.trim() === "") {
        alert("未填写账号")
        return;
      }
      if (password === null || password.trim() === "") {
        alert("未填写密码")
        return;
      }

      let data = {
        account: account,
        password: password,
        code: verification,
      }
      axios.get(
          "http://127.0.0.1:8199/api/auth/login?account="+account+"&password="+password
      ).then(res => {
        console.log(res)
        if (res.data.code === 200) {
          setCookie(TOKEN_NAME, res.data.data, null)
          router.push("map")
        } else {
          alert(res.data.msg)
        }
      })

    }
  }
}
</script>
<style lang="scss" scoped>
.page {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background-color: white;

  display: flex;
  align-content: center;
  justify-content: center;

  .bg-box {
    position: absolute;
    top: 0;
    left: 0;
    z-index: -1;
    width: 100%;
    height: 100%;

    .bg-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  .left {
    flex: 4;

    .img-left {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  .right {
    flex: 1;
    //padding: 20px;
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    align-content: center;
    justify-content: center;

    .login_page {
      position: relative;
      width: 360px;
      left: 5px;
      //aspect-ratio: 0.618;
      background: white;
      border-radius: 16px;
      box-shadow: 0 3px 12px 0 rgba(0, 0, 0, 0.15);

      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;

      .login_title {

        //width: 100px;
        //text-align: center;
        font-size: 50px;
        font-weight: 700;
        margin-bottom: 10px;
      }

      .login_item {
        width: 200px;
        display: flex;
        flex-direction: column;
        gap: 10px;

        .common-label {
          font-size: 13px;
          line-height: 16px;
          color: #7d7474;
        }

        .account-input {
          width: 100%;
          border: none;
          border-bottom: aqua;

          .form-input {
            width: 100%;
            border: none;
            border-bottom: 1px solid;
          }
        }
        .verification_item{
          display: flex;
          flex-direction: column;
          gap: 10px;
          height: 50px;
        }
        .verification2_input {
          display: flex;
          flex-direction: row;
          justify-content: flex-start;

        }

        .verification_input {
          width: 150px;
          border: none;
          border-bottom: 1px solid;
        }

        .verification_box {
          width: 40px;
          height: 17px;

          .verification_img {
            width: 60px;
            height: 18px;

          }
        }


        .password_input {
          width: 100%;

          .form-input {
            width: 100%;
            border: none;
            border-bottom: 2px solid;
          }
        }

        .btnrow {
          display: flex;
          flex-direction: row;
          gap: 16px;

          .b-share {
            flex: 1;
            border: none;
            padding: 8px;
            border-radius: 2px;
            box-shadow: 0 3px 12px 0 rgba(0, 0, 0, 0.12);
            //cursor: url('@/assets/b.jpg'),auto;
            transition: 0.3s all ease-in-out;
          }

          .b-login {
            background: #2382e1;
            color: white;

            &:hover {
              background: #0e62b7;
              box-shadow: 3px 3px 3px 0 rgba(0, 0, 0, 0.3);
            }
          }

          .b-rig {
            background: #21bb7b;
            color: white;

            &:hover {
              background: #0b9f60;
              box-shadow: 3px 3px 3px 0 rgba(0, 0, 0, 0.3);
            }
          }
        }


      }
    }
  }
}
</style>