<template>
  <div class="my-container">
    <van-cell-group v-if="user" class="my-info">
      <van-cell 
      class="base-info"
      title="单元格" 
      value="内容"
      center
      :border="false"
      >
        <van-image
          class="avatar"
          slot="icon"
          round
          fit="cover"
          :src="currentUser.photo"
        />
        <div class="name" slot="title">{{currentUser.name}}</div>
        <!-- <div slot="default">编辑资料</div> -->
        <!-- 这个不用加slot，因为会默认放到最右 -->
        <van-button
          class="update-btn"
          size="small"
          round
        >编辑资料</van-button>
      </van-cell>
      <van-grid class="data-info" :border="false">
        <van-grid-item class="data-info-item">
          <div class="text-wrap" slot="text">
            <div class="count">{{currentUser.art_count}}</div>
            <div class="text">头条</div>
          </div>
        </van-grid-item >
        <van-grid-item class="data-info-item">
          <div class="text-wrap" slot="text">
            <div class="count">{{currentUser.follow_count}}</div>
            <div class="text">关注</div>
          </div>
        </van-grid-item>
        <van-grid-item class="data-info-item">
          <div class="text-wrap" slot="text">
            <div class="count">{{currentUser.fans_count}}</div>
            <div class="text">粉丝</div>
          </div>
        </van-grid-item>
        <van-grid-item class="data-info-item">
          <div class="text-wrap" slot="text">
            <div class="count">{{currentUser.like_count}}</div>
            <div class="text">获赞</div>
          </div>
        </van-grid-item>
      </van-grid>
    </van-cell-group>

    <div v-else class="not-login">
      <div @click="$router.push('/login')">
        <img  class="mobile" src="" alt="">
      </div>
      <div class="text">登录 / 注册</div>
    </div>

    <van-grid  class="nav-grid mb-4" :column-num="2">
      <van-grid-item 
        class="nav-grid-item"
        icon-prefix="toutiao"
        icon="shoucang" 
        text="收藏" 
        />
      <van-grid-item 
        class="nav-grid-item"
        icon-prefix='toutiao'
        icon='lishi' 
        text="历史"/>
    </van-grid>

    <van-cell title="消息通知" is-link to="" />
    <van-cell class="mb-4" title="小智同学" is-link to="" />
    <van-cell 
      v-if="user"
      class="logout-cell" 
      title="退出登录" 
      @click="onLogOut"
      />
  </div>
</template>

<script>
// 将vuex里的数据映射到此组件中，然后像使用自己的数据一样来使用vuex里的数据
import { mapState } from 'vuex'
import { getCurrentUser } from '@/api/user'

export default {
  name: 'MyIndex',
  data() {
    return {
      currentUser: {} //当前登录用户信息
    }
  },
  // 即映射this.user为store.state.user
  computed: {
    ...mapState(['user'])
  },
  created () {
    this.loadCurrentUser()
  },
  methods: {
    async loadCurrentUser() {
      const {data} = await getCurrentUser()
      console.log(data);
      this.currentUser = data.data
    },
    onLogOut () {
      //提示用户确认退出
      //确认 -> 处理退出
      this.$dialog.confirm({
      title: '退出提示',
      message: '确认退出吗?'
    })
      .then(() => { //确认执行这里
        // 清除用户登录状态
        //因为视图都是基于v-if=“user“来显示的，user一旦变换为null，则对应的视图就自动不会显示了
        this.$store.commit('setUser', null)
      })
      .catch(() => {  //退出执行这里
        // on cancel
      });
    }
  }
}
</script>

<style scoped lang='less'>
.my-container {
  .my-info {
    background-color: pink;
    .base-info {
      box-sizing: border-box;
      height: 115px;
      background-color: unset;
      padding-top: 38px;
      padding-bottom: 11px;
      .avatar {
        box-sizing: border-box;
        width: 66px;
        height: 66px;
        border: 1px solid #fff;
        margin-right: 11px;
      }
      .name {
        color: #fff;
        font-size: 15px;
      }
      .update-btn {
        height: 16px;
        font-size: 10px;
        color: #666;
      }
    }

    .data-info {
      .data-info-item {
        height: 65px;
        color: #fff;
        .text-wrap {
          display: flex;
          // 调整主轴方向为向下垂直，默认为水平
          flex-direction: column;
          justify-content: center;
          align-items: center;
          .count {
            font-size: 18px;
          }
          .text {
            font-size: 11px;
          }
        }
        
      }
    }

    /deep/ .van-grid-item__content {
      background-color: unset;
    }
  }

  .not-login {
    height: 180px;
    background-color: pink;
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    .mobile {
      width: 66px;
      height: 66px;
    }
    .text {
      font-size: 14px;
      color: #fff
    }
  }

  /deep/ .nav-grid {
      .nav-grid-item {
        height: 70px;
        .toutiao {
          font-size: 22px;
        }
        .toutiao-shoucang {
          color: #eb5253;
        }
        .toutiao-lishi {
          color: #ff9d1d;
        } 
        .van-grid-item__text {
          font-size: 14px;
          color: #333333;
        }
      }
    }

    .logout-cell {
      text-align: center;
      color: #d86262;
    }
    .mb-4 {
      margin-bottom: 4px;
    }

}

</style>
