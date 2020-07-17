export default {
  data() {
    return {
      loading: true,
      data: [],
      time: 50,
      isAdd: false
    }
  },
  methods: {
    // 预防删除第二页最后一条数据时，或者多选删除第二页的数据时，页码错误导致请求无数据
    dleChangePage(size) {
      if (size === undefined) {
        size = 1
      }
      if (this.data.length === size && this.page !== 0) {
        this.page = this.page - 1
      }
    }
  }
}
