<template>
  <div class="channel-edit">
    <!-- 我的频道 -->
    <van-cell :border="false">
      <div slot="title" class="title-text">频道编辑</div>
      <van-button type="danger" plain round size="mini" class="edit-btn" @click="isEdit = !isEdit">{{ isEdit ? '完成' :
          '编辑'
      }}
      </van-button>
    </van-cell>
    <van-grid class="my-grid" :gutter="10">
      <van-grid-item class="grid-item" v-for="(channel, index) in myChannels" :key="index"
        @click="onUpdateActive(channel, index)">
        <van-icon slot="icon" name="clear" v-show="isEdit && !fiexdChannels.includes(channel.id)"></van-icon>
        <!-- v-bind :class 语法
      一个对象中，对象中的key表示要作用的css类名
                  对象中的value 要计算出布尔值
                  true则作用该类名
                  false不做用该类名
      -->
        <span slot="text" class="text" :class="{ active: index === active }">{{ channel.name }}</span>
      </van-grid-item>
    </van-grid>
    <!-- /我的频道 -->
    <!-- 频道推荐 -->
    <van-cell :border="false">
      <div slot="title" class="title-text">频道推荐</div>
    </van-cell>
    <van-grid class="recommend-grid" :gutter="10">
      <van-grid-item class="grid-item" v-for="(channel, index) in recommentChannels" :key="index" :text="channel.name"
        icon="plus" @click="onAddChannel(channel)" />
    </van-grid>
    <!-- /频道推荐 -->
  </div>
</template>

<script>
import { getAllChannels, addUserChannel, deleteUserChannel } from '@/api/channel.js'
import { mapState } from 'vuex'
import { setItem } from '@/utils/storage'
export default {
  name: 'ChannelEdit',
  components: {},
  props: {
    myChannels: {
      type: Array,
      required: true
    },
    active: {
      type: Number,
      required: true
    }
  },
  data () {
    return {
      allChannels: [], // 所有频道
      isEdit: false, // 控制编辑状态的显示
      fiexdChannels: [0] // 固定频道，不允许删除
    }
  },
  computed: {
    ...mapState(['user']),
    // 计算属性会观测内部依赖数据的变化
    // 如果依赖的数据发生变化，则计算属性会重新执行
    recommentChannels () {
      // 数组filter 方法: 遍历数组，把符合条件的元素存储到新数组中并返回
      return this.allChannels.filter((channel) => {
        // const channels = []
        // 数组的 find方法: 遍历数组，把复合条件的第一个元素返回
        return !this.myChannels.find((myChannel) => {
          return myChannel.id === channel.id
        })
        // return channels
      })
    }
    //   const channels = []
    //   this.allChannels.forEach((channel) => {
    //     // find 遍历数组，找到满足条件的元素项
    //     const reg = this.myChannels.find((myChannels) => {
    //       return channel.id === myChannels.id
    //     })
    //     // 如果我的频道中不包括该频道项，则收集到推荐频道中
    //     if (!reg) {
    //       channels.push(channel)
    //     }
    //   })
    //   // 把计算结果返回
    //   return channels
  },
  watch: {},
  created () {
    this.loadAllChannels()
  },
  mounted () { },
  methods: {
    // 加载所有频道
    async loadAllChannels () {
      try {
        const { data } = await getAllChannels()
        this.allChannels = data.data.channels
      } catch (err) {
        this.toast('获取数据失败')
      }
    },
    // 点击推荐频道，添加频道
    async onAddChannel (channel) {
      this.myChannels.push(channel)
      if (this.user) {
        try {
          // 数据持久化处理
          // 已登录，把数据请求接口放到线上
          await addUserChannel({
            id: channel.id, // 频道id
            seq: this.myChannels.length // 序号
          })
        } catch (err) {
          this.$toast('保存失败，请稍后重试')
        }
      } else {
        // 未登录，把数据储存到本地
        setItem('TOUTIAO_CHANNELS', this.myChannels)
      }
    },
    // 我的频道-点击频道事件
    onUpdateActive (channel, index) {
      // 1.编辑状态, 执行删除频道
      if (this.isEdit) {
        // 1.1 如果是固定频道，则不删除
        if (this.fiexdChannels.includes(channel.id)) { return }
        // 1.2 删除频道项
        this.myChannels.splice(index, 1)
        // 1.3 如果删除的是激活频道之前的频道，则更新激活的频道选项
        // 步数1: 要删除的元素的激活索引(包括)
        // 步数2：删除的个数，如果不指定，从参数1开始一直删除到最后
        if (index <= this.active) {
          // 让激活频道的索引 -1
          this.$emit('updata-active', this.active - 1, true)
        }
        // 4.处理持久化
        this.deleteChannel(channel)
      } else {
        // 2.非编辑状态, 执行切换频道
        console.log(channel, index)
        this.$emit('updata-active', index)
      }
    },
    // 删除频道-持久化
    async deleteChannel (channel) {
      // 已登录，则将数据更新到线上
      try {
        if (this.user) {
          await deleteUserChannel(channel.id)
        } else {
          // 未登录，将数据更新到本地
          setItem('TOUTIAO_CHANNELS', this.myChannels)
        }
      } catch (err) {
        this.$toast('操作失败，请稍后重试')
      }
    }
  }
}
</script>

<style lang="less" scoped>
.channel-edit {
  padding: 85px 0;

  .van-cell {
    .van-cell__value {
      display: flex;
      justify-content: end;
    }
  }

  // 编辑频道标题
  .title-text {
    font-size: 32px;
    color: #333;
  }

  // 编辑频道按钮
  .edit-btn {
    width: 104px;
    height: 48px;
    font-size: 26px;
    color: #f85959;
    border: 1px solid #f85959
  }

  // 宫格区域
  /deep/.grid-item {
    width: 160px;
    height: 86px;

    .van-grid-item__content {
      background-color: #f4f5f6;
      white-space: nowrap;

      .van-grid-item__text,
      .text {
        font-size: 28px;
        color: #222;
        margin-top: 0;
      }

      .active {
        color: red;
      }

      .van-grid-item__icon-wrapper {
        position: unset;
      }
    }
  }

  // 我的频道宫格区域
  /deep/ .my-grid {
    .grid-item {
      .van-icon-clear {
        position: absolute;
        right: -10px;
        top: -10px;
        font-size: 30px;
        color: #cacaca;
        z-index: 2;
      }
    }
  }

  // 推荐频道宫格区域
  /deep/ .recommend-grid {
    .grid-item {
      .van-grid-item__content {
        flex-direction: row;

        .van-icon-plus {
          font-size: 22px;
          margin-right: 6px;
        }
      }
    }
  }
}
</style>
