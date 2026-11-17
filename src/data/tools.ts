export interface Tool {
  id: string;
  title: string;
  description: string;
  url: string;
  domain: string;
  tags: string[];
  madeByMe: boolean;
  free?: boolean;
  searchTerms: string[];
}

// 在这里添加工具，页面数量、搜索和分类会自动更新。
export const tools: Tool[] = [
  {
    id: 'condition-8558',
    title: '澳洲 8558 停留时间计算器',
    description:
      '18 个月内最多停留 12 个月，到底怎么算？输入出入境日期，帮你理清澳洲签证的停留时间，安心安排下一程。',
    url: 'https://condition-8558.mutoo.im',
    domain: 'condition-8558.mutoo.im',
    tags: ['澳洲生活', '签证工具'],
    madeByMe: true,
    free: true,
    searchTerms: ['澳大利亚', '旅游', '日历', '计算', 'visa', 'Australia', 'condition', 'calculator'],
  },
];
