<template>
  <div class="update-gender">
    <van-picker show-toolbar title="标题" :columns="columns" @confirm="onConfirm" @cancel="$emit('close')"
      :default-index="value" @change="onPickChange" />
  </div>
</template>

<script>
import { updateUserProfile } from '@/api/user'
export default {
  name: 'UpdateGender',
  components: {},
  props: {
    value: {
      type: Number,
      required: true
    }
  },
  data () {
    return {
      columns: ['男', '女'],
      localGender: this.value
    }
  },
  computed: {},
  watch: {},
  created () { },
  mounted () { },
  methods: {
    async onConfirm () {
      this.$toast.loading({
        message: '保存中……',
        forbidClick: true, // 禁止背景点击
        duration: 0 // 持续展示
      })
      try {
        const localGender = this.localGender
        await updateUserProfile({ gender: localGender })
        // 关闭弹框
        this.$emit('close')
        // 更新视图
        this.$emit('input', this.localGender)
        // 提示成功
        this.$toast.success('更新成功')
      } catch (err) {
        this.toast.fail('更新失败')
      }
    },
    onPickChange (picker, value, index) {
      console.log(picker, value, index)
      this.localGender = index
    }
  }
}
</script>

<style lang="less" scoped>
</style>
