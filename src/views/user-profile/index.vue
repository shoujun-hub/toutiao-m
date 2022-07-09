<template>
  <div class="user-profile">
    <!-- 导航栏 -->
    <van-nav-bar class="page-nav-bar" title="个人信息" left-arrow @click-left="$router.back()"></van-nav-bar>
    <!-- /导航栏 -->
    <input type="file" hidden ref="file" @change="onFileChange">
    <!-- 个人信息 -->
    <van-cell title="头像" is-link>
      <van-image class="avatar" fit="cover" round :src="user.photo" @click="$refs.file.click()" />
    </van-cell>
    <van-cell title="昵称" :value="user.name" is-link @click="isUpdataNameShow = true" />
    <van-cell title="性别" :value="user.gender === 0 ? '男' : '女'" is-link @click="isUpdateGenderShow = true" />
    <van-cell title="生日" :value="user.birthday" is-link @click="isUpdateBirthdayShow = true" />
    <!-- /个人信息 -->
    <!-- 编辑昵称 -->
    <van-popup v-model="isUpdataNameShow" style="height:100%" position="bottom">
      <UpdateName v-if="isUpdataNameShow" @close="isUpdataNameShow = false" v-model="user.name" />
    </van-popup>
    <!-- /编辑昵称 -->
    <!-- 编辑性别 -->
    <van-popup v-model="isUpdateGenderShow" position="bottom">
      <UpdateGender v-if="isUpdateGenderShow" @close="isUpdateGenderShow = false" v-model="user.gender" />
    </van-popup>
    <!-- /编辑性别 -->
    <!-- 编辑生日 -->
    <van-popup v-model="isUpdateBirthdayShow" position="bottom">
      <UpdateBirthday v-if="isUpdateBirthdayShow" @close="isUpdateBirthdayShow = false" v-model="user.birthday" />
    </van-popup>
    <!-- /编辑生日 -->
    <!-- 编辑头像 -->
    <van-popup v-model="isUpdatePhotoShow" position="bottom" style="height:100%">
      <UpdatePhoto :img="img" @close="isUpdatePhotoShow = false" @update-photo="user.photo = $event" />
    </van-popup>
    <!-- /编辑头像 -->
  </div>
</template>

<script>
import { getUserProfile } from '@/api/user'
import UpdateName from './components/update-name'
import UpdateGender from './components/update-gender'
import UpdateBirthday from './components/update-birthday'
import UpdatePhoto from './components/update-photo'
export default {
  name: 'UserProfile',
  components: { UpdateName, UpdateGender, UpdateBirthday, UpdatePhoto },
  props: {},
  data () {
    return {
      user: {}, // 个人信息
      isUpdataNameShow: false, // 是否显示昵称弹框
      isUpdateGenderShow: false, // 是否显示性别弹框
      isUpdateBirthdayShow: false, // 是否显示生日弹框
      isUpdatePhotoShow: false, // 是否显示头像弹框
      img: null // 预览的图片
    }
  },
  computed: {},
  watch: {},
  created () {
    this.loadUserProfile()
  },
  mounted () { },
  methods: {
    async loadUserProfile () {
      try {
        const { data } = await getUserProfile()
        this.user = data.data
      } catch (err) {
        this.$toast('获取用户资料失败')
      }
    },
    onFileChange () {
      // 获取文件对象
      const file = this.$refs.file.files[0]
      // 基于文章对象获取blob数据
      this.img = window.URL.createObjectURL(file)
      // 展示预览图片弹出层
      this.isUpdatePhotoShow = true
      // file-input 如果选了同一个文件不会触发change事件
      // 解決办法就是每次使用完毕，把它的value清空
      this.$refs.file.value = ''
    }
  }
}
</script>

<style lang="less" scoped>
.user-profile {
  .avatar {
    width: 60px;
    height: 60px;
  }

  .van-popup {
    background-color: #f5f7f9;
  }
}
</style>
