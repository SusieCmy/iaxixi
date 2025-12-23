/**
 * 埋点事件统一管理工具
 * 集中管理 Google Analytics 和 Google Tag Manager 事件
 */

import { sendGAEvent, sendGTMEvent } from '@next/third-parties/google'

/**
 * 事件分类
 */
export enum EventCategory {
  USER = 'user', // 用户行为
  NAVIGATION = 'navigation', // 导航行为
  CONTENT = 'content', // 内容交互
  SOCIAL = 'social', // 社交分享
  FORM = 'form', // 表单交互
}

/**
 * 事件动作
 */
export enum EventAction {
  CLICK = 'click',
  VIEW = 'view',
  SUBMIT = 'submit',
  DOWNLOAD = 'download',
  SHARE = 'share',
  SCROLL = 'scroll',
}

/**
 * GA4 事件追踪
 */
export const trackGAEvent = {
  /**
   * 用户点击头像/名称
   */
  clickUserName: () => {
    sendGAEvent('event', 'click_user_name', {
      category: EventCategory.USER,
      label: '点击用户名称',
    })
  },

  /**
   * 查看统计数据
   */
  viewStats: () => {
    sendGAEvent('event', 'view_stats', {
      category: EventCategory.CONTENT,
      label: '查看数据统计',
    })
  },

  /**
   * 点击社交链接
   */
  clickSocialLink: (platform: string) => {
    sendGAEvent('event', 'click_social_link', {
      category: EventCategory.SOCIAL,
      label: platform,
      platform,
    })
  },

  /**
   * 导航到博客
   */
  navigateToBlog: () => {
    sendGAEvent('event', 'navigate_to_blog', {
      category: EventCategory.NAVIGATION,
      label: '访问博客',
    })
  },

  /**
   * 导航到项目
   */
  navigateToProjects: () => {
    sendGAEvent('event', 'navigate_to_projects', {
      category: EventCategory.NAVIGATION,
      label: '访问项目',
    })
  },

  /**
   * 点击技术标签
   */
  clickTechTag: (tech: string, category: string) => {
    sendGAEvent('event', 'click_tech_tag', {
      category: EventCategory.CONTENT,
      label: tech,
      tech_name: tech,
      tech_category: category,
    })
  },

  /**
   * 查看学习中的技术
   */
  viewLearningTech: (tech: string) => {
    sendGAEvent('event', 'view_learning_tech', {
      category: EventCategory.CONTENT,
      label: tech,
      tech_name: tech,
    })
  },

  /**
   * 页面浏览 (通用)
   */
  pageView: (pageName: string) => {
    sendGAEvent('event', 'page_view', {
      category: EventCategory.NAVIGATION,
      label: pageName,
      page_name: pageName,
    })
  },

  /**
   * 自定义事件
   */
  custom: (eventName: string, params?: Record<string, unknown>) => {
    sendGAEvent('event', eventName, params || {})
  },
}

/**
 * GTM 事件追踪
 */
export const trackGTMEvent = {
  /**
   * 用户点击头像/名称
   */
  clickUserName: () => {
    sendGTMEvent({
      event: 'user_name_clicked',
      category: EventCategory.USER,
      action: EventAction.CLICK,
      label: '用户名称点击',
    })
  },

  /**
   * 查看统计数据
   */
  viewStats: () => {
    sendGTMEvent({
      event: 'stats_viewed',
      category: EventCategory.CONTENT,
      action: EventAction.VIEW,
      label: '数据统计查看',
    })
  },

  /**
   * 点击社交链接
   */
  clickSocialLink: (platform: string) => {
    sendGTMEvent({
      event: 'social_link_clicked',
      category: EventCategory.SOCIAL,
      action: EventAction.CLICK,
      platform,
      label: `社交链接-${platform}`,
    })
  },

  /**
   * 导航事件
   */
  navigate: (destination: string) => {
    sendGTMEvent({
      event: 'navigation',
      category: EventCategory.NAVIGATION,
      action: EventAction.CLICK,
      destination,
      label: `导航至-${destination}`,
    })
  },

  /**
   * 点击技术标签
   */
  clickTechTag: (tech: string, category: string) => {
    sendGTMEvent({
      event: 'tech_tag_clicked',
      category: EventCategory.CONTENT,
      action: EventAction.CLICK,
      tech_name: tech,
      tech_category: category,
      label: `技术标签-${tech}`,
    })
  },

  /**
   * 自定义事件
   */
  custom: (eventName: string, data?: Record<string, unknown>) => {
    sendGTMEvent({
      event: eventName,
      ...data,
    })
  },
}

/**
 * 统一埋点接口 - 同时触发 GA 和 GTM
 */
export const analytics = {
  /**
   * 用户点击头像/名称
   */
  clickUserName: () => {
    trackGAEvent.clickUserName()
    trackGTMEvent.clickUserName()
  },

  /**
   * 查看统计数据
   */
  viewStats: () => {
    trackGAEvent.viewStats()
    trackGTMEvent.viewStats()
  },

  /**
   * 点击社交链接
   */
  clickSocialLink: (platform: string) => {
    trackGAEvent.clickSocialLink(platform)
    trackGTMEvent.clickSocialLink(platform)
  },

  /**
   * 导航到博客
   */
  navigateToBlog: () => {
    trackGAEvent.navigateToBlog()
    trackGTMEvent.navigate('blog')
  },

  /**
   * 导航到项目
   */
  navigateToProjects: () => {
    trackGAEvent.navigateToProjects()
    trackGTMEvent.navigate('projects')
  },

  /**
   * 点击技术标签
   */
  clickTechTag: (tech: string, category: string) => {
    trackGAEvent.clickTechTag(tech, category)
    trackGTMEvent.clickTechTag(tech, category)
  },

  /**
   * 查看学习中的技术
   */
  viewLearningTech: (tech: string) => {
    trackGAEvent.viewLearningTech(tech)
  },

  /**
   * 页面浏览
   */
  pageView: (pageName: string) => {
    trackGAEvent.pageView(pageName)
  },
}

/**
 * 导出统一的埋点工具
 */
export default analytics
