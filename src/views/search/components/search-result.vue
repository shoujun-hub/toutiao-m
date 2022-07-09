<template>
  <div class="search-result">
    <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad" :error.sync="error"
      error-text="请求失败，点击重新加载">
      <van-cell v-for="(article, index) in list" :key="index" :title="article.title" />
    </van-list>
  </div>
</template>

<script>
import { getSearchResult } from '@/api/search'
export default {
  name: 'SearchResult',
  components: {},
  props: {
    searchText: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      list: [],
      loading: false,
      finished: false,
      page: 1, // 当前页数
      per_page: 20, // 每页几条数据
      error: false
    }
  },
  computed: {},
  watch: {},
  created () { },
  mounted () { },
  methods: {
    async onLoad () {
      try {
        // 1.请求获取数据
        const { data } = await getSearchResult({
          page: this.page, // 页码
          per_page: this.per_page, // 每页大小
          q: this.searchText // 查询关键词
        })
        // 模拟随机加载失败
        // if (Math.random() > 0.5) { JSON.parse('asd') }
        // 2.将数据添加到数组列表中
        const { results } = data.data
        this.list.push(...results)
        // 3.将本次加载中的loading关闭
        this.loading = false
        // 4.判断是否还有数据
        if (results.length) {
          this.page++
        } else {
          this.finished = true
        }
        // 如果有，则更新获取下一个数据的页码
        // 如果没有，则将加载状态finished设置为结束
      } catch (err) {
        // 展示加载失败的提示状态
        this.error = true
        // 加载失败了 loading 也要关闭
        this.loading = false
      }
    }
  }
}
</script>

<style lang="less" scoped>
</style>
