<template>
  <div class="article-list">
    <van-pull-refresh v-model="isreFreshLoading" @refresh="onRefresh" :success-text="refreshSuccessText"
      :success-duration="1500">
      <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad" :error.sync="error"
        error-text="请求失败，点击重新加载">
        <!-- <van-cell v-for="(articles, index) in list" :key="index" :title="articles.title" /> -->
        <ArticleItem v-for="(articles, index) in list" :key="index" :article="articles" />
        <!-- List 列表组件:瀑布流滚动加载，用于展示长列表。
          List 组件通过loading 和 finished 两个变量控制加载状态
          当组件初始化或滚动到底部时，会触发load事件并将loading 设置成true，
          此时可以发起异步操作并更新数据。
          数据更新完毕后，将loading设置成false即可
          若数据已经全部加载完毕，则直接将finished设置成true即可

          -load 事件:
          + List 初始化后会触发一次load事件，用于加载第一屏的数据
          + 如果一次请求加载的数据条数较少，导致列表内容无法铺满当前屏幕，List
          会继续触发load事件，知道内容铺满屏幕或数据全部加载完毕

          -loading 属性: 控制加载中的loading状态
          + 并非加载中，loading为false,此时会根据列表滚动位置判断是否触发load事件
          (列表内容不足一屏幕时，会直接触发)
          + 加载中，loading为true，表示正在发送异步请求，此时不会触发load事件

          - finished 属性:控制加载结束的状态
          + 在每次请求完毕后，需要手动将loading 设置为false，表示本次加载结束
          + 所有数据加载结束，finnished为true，此时不会触发load事件。
          // 初始化或滚动底部的时候会触发调用 onLoad
            onLoad () {
              console.log('onLoad')
              // 1.请求获取数据
              // setTimeout 仅做示例，真实场景中一般为 ajax 请求
              setTimeout(() => {
                // 2.把请求结果数据放到 list 数组中
                for (let i = 0; i < 10; i++) {
                  this.list.push(this.list.length + 1)
                }
                // 3.本次数据加载结束之后要把加载状态设置为结束
                // loading 关闭以后才能触发下一次的加载更多
                this.loading = false
                // 4.判断数据是否全部加载完成
                if (this.list.length >= 40) {
                  // 如果没有数据了，把finished设置为true，之后不再触发加载更多
                  this.finished = true
                }
              }, 1000)
            }

        -->
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import { getArticles } from '@/api/article'
import ArticleItem from '@/components/article-item/index'
export default {
  name: 'ArticleList',
  components: {
    ArticleItem
  },
  props: {
    channels: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      list: [], // 存储列表数据的数据
      loading: false, // 控制加载中loading状态
      finished: false, // 控制数据加载结束后的状态
      timestamp: null, // 请求获取下一页数据的时间戳
      error: false, // 控制列表加载失败的提示状态
      isreFreshLoading: false, // 控制下拉刷新的 loading
      refreshSuccessText: '刷新成功' // 下拉刷新成功提示文本
    }
  },
  computed: {},
  watch: {},
  created () { },
  mounted () { },
  methods: {
    // 初始化或滚动底部的时候会触发调用 onLoad
    async onLoad () {
      // 1.请求获取数据
      try {
        const { data } = await getArticles({
          channel_id: this.channels.id, // 频道ID
          // timestamp 简单理解就是请求数据的页码
          // 请求第一页数据:当前最新时间戳
          // 用于请求之后数据的时间戳会在当前请求结果中返回给你
          timestamp: this.timestamp || Date.now() // 时间戳，请求新的推荐数据传当前的时间戳，请求历史推荐传指定的时间戳
        })
        console.log(data)
        // 模拟随机失败的情况
        // if (Math.random() > 0.5) {
        //   JSON.parse('adsd')
        // }
        // 2.把请求结果数据放到 list 数组中
        const { results } = data.data
        // 数组的展开操作符，它会把数组一个一个拿出来
        this.list.push(...results)
        // 3.本次数据加载结束之后要把加载状态设置为结束
        this.loading = false
        // 4.判断数据是否全部加载完成
        if (results.length) {
          // 更新获取下一页数据的时间戳
          this.timestamp = data.data.pre_timestamp
        } else {
          // 没有数据了，将finished设置为true，不再load加载更多
          this.finished = true
        }
      } catch (err) {
        console.log('请求失败', err)
        // 展示错误提示状态
        this.error = true
        // 请求失败了，loading也需要关闭
        this.loading = false
      }
    },
    // 当下拉刷新的时候会触发调用该函数
    async onRefresh () {
      try {
        // 1.请求获取数据
        const { data } = await getArticles({
          channel_id: this.channels.id, // 频道ID
          // timestamp 简单理解就是请求数据的页码
          // 请求第一页数据:当前最新时间戳
          // 用于请求之后数据的时间戳会在当前请求结果中返回给你
          timestamp: Date.now() // 时间戳，请求新的推荐数据传当前的时间戳，请求历史推荐传指定的时间戳
        })
        // 模拟随机失败的情况
        // if (Math.random() > 0.2) {
        //   JSON.parse('adsd')
        // }
        const { results } = data.data
        // 2.将参数追加到列表的顶部
        this.list.unshift(...results)
        // 3.关闭下拉刷新的loading 状态
        this.isreFreshLoading = false
        // 更新下拉刷新成功提示的文本
        this.refreshSuccessText = `刷新成功，更新${results.length}了条数据`
      } catch (err) {
        // 重新加载数据
        // 将 loading 设置为 true，表示处于加载状态
        this.isreFreshLoading = false
        this.refreshSuccessText = '刷新失败'
      }
    }
  }
}
</script>

<style lang="less" scoped>
.article-list {
  // 百分比单位是相对于父元素的
  // height:100%;、

  /* 在css3中新增了一种视口单位vw和vh，何为视口，就是根据你浏览器窗口的大小的单位，不受父元素影响
     在移动端，视口单位相当于布局视口
     1vw = 可视窗口宽度的百分之一，比如窗口宽度是750，则1vw = 7.5px
     1vh = 可视窗口高度的百分之一，比如窗口高度时667，则1vh = 6.67px
  */
  height: 79vh;
  overflow-y: auto;
}
</style>
