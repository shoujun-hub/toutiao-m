<template>
  <div class="update-photo">
    <img class="img" :src="img" alt="" ref="img">
    <div class="toolbar">
      <div class="cancel" @click="$emit('close')">取消</div>
      <div class="confirm" @click="onConfirm">完成</div>
    </div>
  </div>
</template>

<script>
import 'cropperjs/dist/cropper.css'
import Cropper from 'cropperjs'
import { updateUserPhoto } from '@/api/user'
export default {
  name: 'UpdatePhoto',
  components: {},
  props: {
    img: {
      type: [String, Object],
      required: true
    }
  },
  data () {
    return {
      cropper: null
    }
  },
  computed: {},
  watch: {},
  created () { },
  mounted () {
    const image = this.$refs.img
    this.cropper = new Cropper(image, {
      viewMode: 1, // 裁剪框只能在画布内显示
      dragMode: 'move', // 拖动模式
      aspectRatio: 1, // 截图比例
      autoCropArea: 1, // 自动截取区域
      cropBoxMovable: false, // 裁剪框是否能移动
      cropBoxResizable: false, // 裁剪框是否能缩放
      background: false, // 背景是否显示
      movable: true // 画布是否可以移动
    })
  },
  methods: {
    onConfirm () {
      // 基于服务端的裁剪使用getData 方法获取裁剪参数
      // console.log(this.cropper.getData())

      // 纯客户端的裁剪使用getCroppedCanvas 获取裁剪的文件对象 (pc端有兼容性问题)
      this.cropper.getCroppedCanvas().toBlob(blob => {
        this.updatePhoto(blob)
      })
    },
    async updatePhoto (blob) {
      this.$toast.loading({
        message: '保存中……',
        forbidClick: true, // 禁止背景点击
        duration: 0 // 持续展示
      })
      try {
        // 错误的用法
        // 如果接口要求 Content-Type 是application/json
        // 则传递普通javaScript对象
        // updateUserPhoto({photo: blob })

        // 如果接口要求 Content-Type 是 multipart/from-data
        // 则你必须传递 FormData 对象
        const formData = new FormData()
        formData.append('photo', blob)

        const { data } = await updateUserPhoto(formData)
        console.log(data)

        // 关闭弹层
        this.$emit('close')
        // 更新视图
        this.$emit('update-photo', data.data.photo)
        // 提示成功
        this.$toast.success('更新成功')
      } catch (err) {
        this.$toast.fail('更新失败')
      }
    }
  }

}

</script>

<style lang="less" scoped>
.update-photo {
  background-color: #000;
  height: 100%;

  .toolbar {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: space-between;

    .cancel,
    .confirm {
      width: 90px;
      height: 90px;
      font-size: 30px;
      display: flex;
      justify-content: center;
      align-content: center;
      color: #fff;
    }
  }

  .img {
    max-width: 100%;
    display: block;
  }
}
</style>
