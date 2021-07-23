<template>
  <div class="login-container">
    <van-nav-bar
      class="app-nav-bar"
      title="注册 / 登录"
      left-arrow
      @click-left="$router.back()"
    />

    <!-- 登录表单 -->
    <!-- 
      基于Vant的表单验证
      1.使用van-form组件包裹所有的表单项van-field
      2.给vant-form绑定submit事件(原先登录按钮的点击事件onlogin转移给submit)
        当表单提交的时候会触发submit事件
       因为只有表单通过验证，才会调用submit事件
      3.使用Field的rules属性定义校验规则
     -->
    <van-form 
      :show-error="false"
      :show-error-message="false"
      :validate-first="true"
      ref="login-form"
      @submit="onLogin" 
      @failed="onFailed"
    >
      <van-field
        v-model="user.mobile"
        icon-prefix="toutiao"
        left-icon="shouji"
        center
        placeholder="请输入手机号"
        name="mobile"
        :rules="formRules.mobile"
      />
      <van-field
        v-model="user.code"
        clearable
        icon-prefix="toutiao"
        left-icon="yanzhengma"
        center
        placeholder="请输入验证码"
        name="code"
        :rules="formRules.code"
      >
        <!-- 点击的时候会默认触发整个表单的提交,故需加上prevent阻止默认行为
        加上了就不会触发表单默认的验证行为（表单提交） -->
        <template #button>
          <van-count-down 
            v-if="isCountDownShow"
            :time="1000 * 60"
            format="ss s" 
            @finish="isCountDownShow = false"
          />
          <van-button 
            v-else
            class="send-btn" 
            size="small" 
            round
            :loading="isSendSmsLoading"
            @click.prevent="onSendSms"
            >发送验证码</van-button>
        </template>
      </van-field>
      <!-- 调样式的话可以一个div包裹住这个按钮 -->
      <div class="login-btn-wrap">
        <van-button 
        class="login-btn" 
        type="info"
        block>
        登录</van-button>
      </div>
    </van-form>
    <!-- /登录表单 -->
  </div>
</template>

<script>
import { login, sendSms } from '@/api/user'
// toast组件必须要从vant库中引入
import { Toast } from 'vant'

export default {
  name: 'LoginIndex',
  data() {
    return {
      user: {
        mobile: '17090086870', //手机号
        code: '246810' //
      },
      formRules: {
        mobile: [
          {required: true, message: '请输入手机号'},
          {pattern: /^1[3|5|7|8|9]\d{9}$/, message:'手机号格式错误'}
        ],
        code: [
          {required: true, message: '请输入验证码'},
          {pattern: /^\d{6}$/, message:'验证码格式错误'}
        ]
      },
      isCountDownShow: false, //控制倒计时和发送按钮的显示与否
      isSendSmsLoading: false //发送验证码按钮的状态
    }
  },
  methods: {
    //点击登录按钮所处理的事情
    async onLogin () {
      //先显示加载中的窗口
      Toast.loading({ //vant组件库中的toast组件
        message: '加载中...', //提示文本
        forbidClick: true, //禁止背景点击
        duration: 0 //展示时长(ms)，默认为2000，值为0时一直显示
      });
      //1.找到数据接口
      //2.封装请求方法
      //3.请求调用登录
      
      //再显示登陆成功或登陆失败
      try {
        const res = await login(this.user)
            //4.处理响应结果
        console.log(res);
        // 新的提示会把之前的提示掩盖掉,故前面加载的提示被掩盖掉了
        Toast.success('登录成功')

        //将后端返回的用户登录状态（token等数据）放到vuex容器中
        this.$store.commit('setUser', res.data.data)

        //登录成功，跳转回原来页面
        this.$router.back()  //先用这种方式，但是不太好，后面再讲
      } catch (err) {
        console.log(err)
        Toast.fail('登录失败,手机号或验证码错误')
      }
    },

    //自定义验证失败的提示消息
    onFailed(error) {
      //如果手机号格式错误，则errors[0]则为第一个
      //如果手机号格式正确，验证码格式错误，则errors[0]为第二个
      //若两个格式都正确，则不存在error.errors[0]
      if(error.errors[0]) {
        //this.$toast等同于Toast
        Toast({
          message: error.errors[0].message, //提示的消息
          position: 'top' //防止手机键盘太高看不见提示消息
        })
      }
    },

    async onSendSms() {
      try {
        //校验手机号码
        await this.$refs['login-form'].validate('mobile')
        //验证通过，请求发送验证码
        this.isSendSmsLoading = true //展示按钮的loading状态，防止网络慢用户一直点击触发发送行为
        await sendSms(this.user.mobile)
        
        //短信发出去了，隐藏发送按钮、显示倒计时
        this.isCountDownShow = true
      }catch (err) {
        // try里面任何代码的错误都会进入catch
        //不同的错误需要有不同的提示,那就需要判断了
        let message= ''
        //发送短信失败的提示
        if(err && err.response && err.response.status == 429) {
          message = '发送太频繁了，请稍后重试'
        }else if(err.name == 'mobile') {
          //手机号验证失败的提示
          message = err.message
        }else {
          //未知错误
          message = '发送失败，请稍后重试'
        }

        //提示用户
         Toast({ 
          message: message, //提示的消息
          position: 'top' //防止手机键盘太高看不见提示消息
        })
      }

      //无论发送验证码成功与否，都要关闭发送按钮的loading状态
      this.isSendSmsLoading = false
      
      
      //验证通过 ->请求发生验证码 ->用户接收短信 ->输入验证码 -> 请求登录
      //请求发送验证码 -> 隐藏发送按钮、显示倒计时
      //倒计时结束 -> 隐藏倒计时、显示发送按钮(自带了finish事件)
    }
  }

}
</script>

<style scoped lang='less'>
.login-container {
  .send-btn {
    width: 78px;
    height: 23px;
    background-color: #ededed;
    .van-button__text {
      font-size: 11px;
      color: #666666;
    }
  }
  .login-btn-wrap {
    padding: 26px 16px;
    .login-btn {
      background-color: #6db4fb;
      border: none;
      .van-button__text {
        font-size: 15px;
      }
    }
  }
}
</style>
