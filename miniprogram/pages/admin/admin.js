const defaultPaths = [
  { name: '办公增效', online: true },
  { name: '生活助手', online: true }
];

Page({
  data: {
    paths: [],
    template: '',
    tplResult: '',
    reviewText: '',
    reviewResult: ''
  },

  onLoad() {
    const paths = wx.getStorageSync('shelfState') || defaultPaths;
    const template = wx.getStorageSync('courseTemplate') || '';
    this.setData({ paths, template });
  },

  toggleShelf(e) {
    const target = e.currentTarget.dataset.name;
    const online = e.detail.value;
    const paths = this.data.paths.map((path) => (path.name === target ? { ...path, online } : path));
    this.setData({ paths });
    wx.setStorageSync('shelfState', paths);
  },

  onTplInput(e) {
    this.setData({ template: e.detail.value });
  },

  saveTpl() {
    wx.setStorageSync('courseTemplate', this.data.template.trim());
    this.setData({ tplResult: '模板已保存' });
  },

  onReviewInput(e) {
    this.setData({ reviewText: e.detail.value });
  },

  review(status) {
    const text = this.data.reviewText.trim();
    if (!text) {
      this.setData({ reviewResult: '请输入待审核内容' });
      return;
    }
    this.setData({
      reviewResult: `内容“${text.slice(0, 20)}...”审核结果：${status === 'pass' ? '通过' : '驳回'}`
    });
  },

  reviewPass() {
    this.review('pass');
  },

  reviewReject() {
    this.review('reject');
  }
});
