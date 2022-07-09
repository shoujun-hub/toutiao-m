<template>
  <div class="comment-list">
    <!-- 只有list在可视范围之内才会检查滚动位置触发onload -->
    <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad" :error.sync="error"
      error-text="请求失败，点击重新加载" :immediate-check="false">
      <comment-item v-for="(item, index) in list" :key="index" :comment="item"
        @reply-click="$emit('reply-click', $event)" />
    </van-list>
  </div>
</template>

<script>
import { getComments } from '@/api/comment'
import CommentItem from './comment-item.vue'
export default {
  name: 'CommentList',
  components: {
    CommentItem
  },
  props: {
    source: {
      type: [Number, String, Object],
      required: true
    },
    list: {
      type: Array,
      default: () => []
    },
    type: {
      type: String,
      // 自定义Prop 数据验证
      validator (value) {
        return ['a', 'c'].includes(value)
      },
      default: 'a'
    }
  },
  data () {
    return {
      // list: [],
      loading: false,
      finished: false,
      error: false,
      offset: null, // (获取下一页数据的标记)
      limit: 10
    }
  },
  computed: {},
  watch: {},
  created () {
    // 当你手动onload的话，它不会自动开始初的loading
    // 所有我们要手动的开启loading
    this.loading = true
    this.onLoad()
  },
  mounted () { },
  methods: {
    async onLoad () {
      try {
        // 获取文章的评论和获取评论的回复是同一个接口
        // 唯一的区别是接口参数不一样
        // type
        // a  文章的评论
        // c  评论的回复
        // source
        //     文章的评论，则传递文章的ID
        //     评论的回复，则传递评论的ID

        // 1.请求获取数据
        const { data } = await getComments({
          type: this.type, // 评论类型，a-对文章(article)的评论，c-对评论(comment)的回复
          source: this.source.toString(), // 源id，文章id或评论id
          offset: this.offset, // 获取评论数据的偏移量，值为评论id，表示从此id的数据向后取，不传表示从第一页开始读取数据
          limit: this.limit // 获取的评论数据个数，不传表示采用后端服务设定的默认每页数据量
        })
        // 随机失败
        // if (Math.random() < 0.9) {
        //   JSON.parse('asd')
        // }
        // 2.将数据添加到列表中
        console.log(data)
        const { results } = data.data
        // 把文章品论的总数量传递到外部
        this.$emit('onload-success', data.data)
        this.list.push(...results)
        // 3.将loading设置为false
        this.loading = false
        // 4.判断是否还有数据
        if (results.length !== 0) {
          // 有就更新获取下一页的数据页码
          this.offset = data.data.last_id
        } else {
          // 没有就将finished设置为结束
          this.finished = true
        }
      } catch (err) {
        this.error = true
        this.loading = false
      }
    }
  }
}
</script>

<style lang="less" scoped>
</style>
