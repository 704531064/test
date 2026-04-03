const courses = require('../../data/courses.json');

const assessmentQuestions = [
  '我对 AI 基础概念了解程度（1-5）',
  '我会用 AI 完成文字工作（1-5）',
  '我担心 AI 误导信息（1-5）',
  '我担心隐私泄露（1-5）',
  '我每周愿意学习 AI 的时间（1-5）',
  '我希望 AI 帮助办公效率（1-5）',
  '我希望 AI 帮助生活决策（1-5）',
  '我愿意在社区分享实践（1-5）',
  '我希望获得助教支持（1-5）'
];

Page({
  data: {
    loginStatus: '未登录',
    user: null,
    assessmentQuestions,
    scoreOptions: [1, 2, 3, 4, 5],
    scores: [3, 3, 3, 3, 3, 3, 3, 3, 3],
    personaText: '',
    weekPlan: [],
    paths: [],
    demos: [],
    flashcardText: '',
    postText: '',
    anonymous: false,
    desensitize: true,
    community: [],
    assistantText: '',
    riskText: '',
    riskResult: ''
  },

  onLoad() {
    const community = wx.getStorageSync('community') || [];
    const assistantText = `${courses.assistant.weekly_live}；${courses.assistant.group_qa}`;
    this.setData({
      paths: courses.paths,
      demos: courses.demos,
      community,
      assistantText
    });
  },

  loginPhone() {
    this.setData({
      user: { id: Date.now(), type: 'phone', name: '手机用户' },
      loginStatus: '已登录：手机用户（phone）'
    });
  },

  loginWechat() {
    this.setData({
      user: { id: Date.now(), type: 'wechat', name: '微信用户' },
      loginStatus: '已登录：微信用户（wechat）'
    });
  },

  setScore(e) {
    const idx = Number(e.currentTarget.dataset.index);
    const value = Number(e.detail.value);
    const scores = [...this.data.scores];
    scores[idx] = value;
    this.setData({ scores });
  },

  submitAssessment() {
    const scores = this.data.scores;
    const cognition = (scores[0] + scores[1]) / 2;
    const anxiety = (scores[2] + scores[3]) / 2;
    const scenarioOffice = scores[5];
    const persona = cognition < 3 ? 'AI新手探索者' : (anxiety > 3 ? '谨慎实践者' : '进阶应用者');
    const weekPlan = scenarioOffice >= 4
      ? ['D1 测评回看', 'D2 办公路径课1-2', 'D3 办公路径课3+练习', 'D4 引用核验演示', 'D5 办公路径课4-5', 'D6 社区发布作品', 'D7 小测复盘']
      : ['D1 测评回看', 'D2 生活路径课1-2', 'D3 脱敏演示练习', 'D4 生活路径课3+闪卡', 'D5 提示词对比演示', 'D6 社区提问交流', 'D7 小测复盘'];

    this.setData({
      personaText: `你的画像：${persona}；认知分 ${cognition.toFixed(1)}，焦虑分 ${anxiety.toFixed(1)}。`,
      weekPlan
    });
  },

  showFlashcard() {
    const random = Math.floor(Math.random() * courses.flashcards.length);
    const card = courses.flashcards[random];
    this.setData({ flashcardText: `${card.q} —— ${card.a}` });
  },

  setReminder() {
    wx.setStorageSync('reviewPlan', ['+1天', '+3天', '+7天']);
    wx.showToast({ title: '已设置复习提醒', icon: 'success' });
  },

  onPostInput(e) {
    this.setData({ postText: e.detail.value });
  },

  toggleAnonymous() {
    this.setData({ anonymous: !this.data.anonymous });
  },

  toggleDesensitize() {
    this.setData({ desensitize: !this.data.desensitize });
  },

  maskSensitive(text) {
    return text
      .replace(/1\d{10}/g, '1**********')
      .replace(/\d{17}[\dXx]/g, '******************');
  },

  publishPost() {
    if (!this.data.postText.trim()) {
      wx.showToast({ title: '请输入内容', icon: 'none' });
      return;
    }

    const content = this.data.desensitize ? this.maskSensitive(this.data.postText.trim()) : this.data.postText.trim();
    const post = {
      id: Date.now(),
      user: this.data.anonymous ? '匿名用户' : ((this.data.user && this.data.user.name) || '访客'),
      content,
      likes: 0,
      favs: 0
    };
    const community = [post, ...this.data.community];
    wx.setStorageSync('community', community);
    this.setData({ community, postText: '' });
  },

  updatePost(id, field) {
    const community = this.data.community.map((post) => {
      if (post.id !== id) {
        return post;
      }
      return { ...post, [field]: post[field] + 1 };
    });
    wx.setStorageSync('community', community);
    this.setData({ community });
  },

  likePost(e) {
    this.updatePost(Number(e.currentTarget.dataset.id), 'likes');
  },

  favPost(e) {
    this.updatePost(Number(e.currentTarget.dataset.id), 'favs');
  },

  onRiskInput(e) {
    this.setData({ riskText: e.detail.value });
  },

  checkRisk() {
    const text = this.data.riskText;
    const hits = [];
    if (/1\d{10}/.test(text)) {
      hits.push('手机号');
    }
    if (/\d{17}[\dXx]/.test(text)) {
      hits.push('身份证号');
    }
    if (/银行卡|密码|验证码/.test(text)) {
      hits.push('高风险关键词');
    }
    const risk = /保证收益|医疗诊断|投资内幕/.test(text) ? '存在内容风险，请勿直接执行。' : '未发现明显内容风险。';
    const riskResult = hits.length ? `检测到敏感信息：${hits.join('、')}。建议脱敏后发布。${risk}` : risk;
    this.setData({ riskResult });
  },

  exportData() {
    const payload = {
      user: this.data.user,
      community: this.data.community,
      reviewPlan: wx.getStorageSync('reviewPlan') || []
    };
    wx.setClipboardData({
      data: JSON.stringify(payload, null, 2),
      success: () => {
        wx.showToast({ title: '数据已复制', icon: 'success' });
      }
    });
  },

  deleteData() {
    wx.removeStorageSync('community');
    wx.removeStorageSync('reviewPlan');
    this.setData({ community: [] });
    wx.showToast({ title: '已删除', icon: 'success' });
  }
});
