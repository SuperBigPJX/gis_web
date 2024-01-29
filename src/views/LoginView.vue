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
          <div class="account-label">
            账户:
          </div>
          <div class="account-input">
            <input class="form-input" v-model="form.account" placeholder="请输入账户">
          </div>

          <div class="common-label">
            密码:
          </div>
          <div class="password_input">
            <input class="form-input" v-model="form.password" placeholder="请输入密码">
          </div>

          <div class="common-label">
            验证码:
          </div>
          <div class="password_input">
            <input class="form-input" v-model="form.verification" placeholder="请输入验证码">
            <div class="verification_box">
              <img class="verification_img" @click="getCaptcha" :src="verification_img" alt="">
            </div>

          </div>
          <div class="btnrow">
            <button class="b-login b-share" @click="submit">登录</button>
            <button class="b-rig b-share">注册</button>
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


export default {
  name: "LoginView",
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
  },
  mounted() {
    this.getCaptcha()

  },
  methods: {
    getCaptcha() {
      let that = this
      axios.get(
          "http://10.254.0.99:8199/api/user/getCaptchaImage"
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
      if (verification === null || verification.trim() === ""){
        alert("未填写验证码")
        return;
      }
      let data={
        account: account,
        password: password,
        code: verification,
      }
      axios.post(
          "http://10.254.0.99:8199/api/user/login",data
      ).then(res => {
        console.log(res)
        if (res.data.code===200){
          setCookie(TOKEN_NAME,res.data.data,null)
          alert("login successfully")
          router.push("after")
        }
        else {
          alert(res.data.msg)
          router.push("after")
        }
      })
      // axios({
      //   methods:'post',
      //   url:"http://10.254.0.99:8199/api/user/login",
      //   data:{
      //     account:"",
      //     password:""
      //   }
      // })
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
    flex: 3;

    .img-left {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  .right {
    flex: 1;
    padding: 20px;
    display: flex;
    align-content: center;
    justify-content: center;

    .login_page {
      position: relative;
      width: 320px;
      aspect-ratio: 0.618;
      background: white;
      border-radius: 16px;
      box-shadow: 0 3px 12px 0 rgba(0, 0, 0, 0.15);

      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;

      .login_title {
        width: 100px;
        text-align: center;
        font-size: 24px;
        font-weight: 700;
        margin-bottom: 16px;
      }

      .login_item {
        width: 200px;
        display: flex;
        flex-direction: column;
        gap: 20px;

        .common-label {
          font-size: 30px;
          line-height: 20px;
        }

        .account-input {
          width: 100%;
          border: none;
          border-bottom: aqua;

          .form-input {
            width: 100%;
            border: none;
            border-bottom: 2px solid;
          }
        }

        .verification_box{
          width: 100px;
          height: 50px;

          .verification_img{
            width: 99px;
            height: 49px;

          }
        }
        .common-label {
          font-size: 30px;
          line-height: 20px;
        }

        .password_input {
          width: 100%;

          .form-input {
            width: 100%;
            border: none;
            border-bottom: 2px solid;
          }
        }

        .btnrow{
          display: flex;
          flex-direction: row;
          gap: 16px;

          .b-share{
            flex: 1;
            border: none;
            padding: 8px;
            border-radius: 2px;
            box-shadow: 0 3px 12px 0 rgba(0,0,0,0.12);
            //cursor: url('@/assets/b.jpg'),auto;
            transition: 0.3s all ease-in-out;
          }
          .b-login{
            background: #2382e1;
            color: white;
            &:hover{
              background: #0e62b7;
              box-shadow: 3px 3px 3px 0 rgba(0,0,0,0.3);
            }
          }
          .b-rig{
            background: #21bb7b;
            color: white;
            &:hover{
              background: #0b9f60;
              box-shadow: 3px 3px 3px 0 rgba(0,0,0,0.3);
            }
          }
        }
        //.b-share {
        //  font-size: 16px;
        //  cursor: pointer;
        //  transition: 1s ease-in-out;
        //  line-height: 2em;
        //  background: aquamarine;
        //  border-radius: 10px;
        //
        //  &.b-login {
        //    background: aquamarine;
        //
        //    &:hover {
        //      background: aqua;
        //    }
        //  }
        //
        //  &.b-rig {
        //    background: blue;
        //
        //    &.hover {
        //      background: white;
        //    }
        //  }
        //
        //}
      }
    }
  }
}
</style>