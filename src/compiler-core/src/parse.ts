import { NodeTypes, TagType } from "./ast";

export const baseParse = function (content) {
  const context = createParserContext(content)
  return createRoot(parseChildren(context, []))
}

const parseChildren = function (context, ancestors) {
  const nodes = []

  while(!isEnd(context, ancestors)) {
    let node;
    let s = context.source
    if (s.startsWith("{{")) {
      node = parseInterpolation(context)
    } else if(s[0] === "<") {
      if(/[a-z]/i.test(s[1])) {
        node = parseElement(context, ancestors)
      }
    }

    if(!node) {
      node = parseText(context)
    }

    nodes.push(node)
  }

  return nodes
}

const isEnd = function(context, ancestors) {
  const s = context.source

  if(s.startsWith('</')) {
    const startTag = ancestors[ancestors.length - 1].tag

    if (startsWithEndTagOpen(s, startTag)) {
      return true;
    }
  }

  return !s
}

const startsWithEndTagOpen = function(source, tag) {
  return source.startsWith('</') && source.slice(2, 2 + tag.length).toLowerCase() === tag.toLowerCase()
}

const parseText = function(context) {
  // 寻找字符串内的< 或者 {{
  let endIndex = context.source.length
  const endTags = ['<', '{{']

  for(let i = 0; i < endTags.length; i++) {
    const index = context.source.indexOf(endTags[i])

    if(index !== -1 && index < endIndex) {
      endIndex = index
    }
  }

  // 获取content
  const content = parseTextData(context, endIndex)

  return {
    type: NodeTypes.TEXT,
    content
  }
}

const parseTextData = function(context, length) {
  const content = context.source.slice(0, length)
  // 推进
  advanceBy(context, length)
  return content
}


const parseElement = function(context, ancestors) {
  // 处理<div>
  const element: any = parseTag(context, TagType.START)
  ancestors.push(element)
  element.children = parseChildren(context, ancestors)
  ancestors.pop()

  if(startsWithEndTagOpen(context.source, element.tag)) {
    // 处理</div>
    parseTag(context, TagType.END)
  } else {
    throw new Error('缺少结束标签')
  }
  return element
}

const parseTag = function(context, type) {
  // <div></div>
  // 捕获div
  const match = /^<\/?([a-z]*)/i.exec(context.source)

  const tag = match[1]
  // 删除<div / </div
  advanceBy(context, match[0].length)
  // 删除>右肩括号
  advanceBy(context, 1)

  if(type === TagType.END) return

  return {
    tag,
    type: NodeTypes.ELEMENT,
  }
}

// {{ message }}
const parseInterpolation = function (context) {
  const openDelimiter = "{{"
  const closeDelimiter = "}}"

  // 查找到结束括号的位置
  // closeIndex = 11
  const closeIndex = context.source.indexOf(closeDelimiter, openDelimiter.length)
  // 截取字符串 message }}
  advanceBy(context, openDelimiter.length)

  // 获取除{{和}}外的总长度
  // rawContentLength = 9
  const rawContentLength = closeIndex - openDelimiter.length
  // rawContent = 空格message空格
  // const rawContent = context.source.slice(0, rawContentLength)
  const rawContent = parseTextData(context, rawContentLength)
  // content = message
  const content = rawContent.trim()

  // advanceBy(context, rawContentLength + closeDelimiter.length)
  advanceBy(context, closeDelimiter.length)

  return {
    type: NodeTypes.INTERPOLATION,
    content: {
      type: NodeTypes.SIMPLE_EXPRESSION,
      content: content
    }
  }
}

const advanceBy = function (context, length) {
  // 从length开始向后截取全部
  context.source = context.source.slice(length)
}

const createRoot = function (children) {
  return {
    children
  }
}

const createParserContext = function (context) {
  return {
    source: context
  }
}


