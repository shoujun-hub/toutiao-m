<template>
  <div>
    <van-nav-bar :title="comment.reply_count > 0 ? comment.reply_count + '条回复' : '暂无回复'">
      <van-icon slot="left" name="cross" @click="$emit('close')" />
    </van-nav-bar>
    <div class="scroll-wrap">
      <!-- 当前评论项 -->
      <CommentItem :comment="comment" />
      <!-- /当前评论项 -->
      <!-- 评论的回复列表 -->
      <van-cell title="全部回复" />
      <CommentList :source="comment.com_id" :type="'c'" :list="commentList" />
      <!-- /评论的回复列表 -->
    </div>
    <!-- 底部区域 -->
    <div class="post-wrap">
      <van-button size="mini" round class="post-btn" @click="isPostShow = true">写评论</van-button>
    </div>
    <!-- /底部区域 -->
    <!-- 发布评论 -->
    <van-popup v-model="isPostShow" position="bottom">
      <CommentPost :target="comment.com_id" @post-success="onPostSuccess"/>
    </van-popup>
    <!-- /发布评论 -->

  </div>
</template>

<script>
import CommentItem from './comment-item.vue'
import CommentList from './article-comment'
import CommentPost from './comment-post'
export default {
  name: 'CommentReply',
  components: {
    CommentItem,
    CommentList,
    CommentPost
  },
  props: {
    comment: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      isPostShow: false,
      commentList: [] // 评论的回复列表
    }
  },
  computed: {},
  watch: {},
  created () { },
  mounted () { },
  methods: {
    onPostSuccess (data) {
      // 更新回复的数量
      this.comment.reply_count++
      // 关闭弹层
      this.isPostShow = false
      // 将最新回复的内容展示到列表的顶部
      this.commentList.unshift(data.new_obj)
    }
  }
}
</script>

<style lang="less" scoped>
.scroll-wrap {
  position: fixed;
  top: 92px;
  left: 0;
  right: 0;
  bottom: 88px;
  overflow-y: auto;
}

.post-wrap {
  position: fixed;
  height: 88px;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #fff;
  border-top: 1px solid #d8d8d8;

  .post-btn {
    width: 60%;
  }
}
</style>
