---
title: "React Hooks 最佳实践"
description: "掌握 React Hooks 的正确使用方法，编写更优雅的组件"
date: "2024-01-10"
tags: ["React", "Hooks", "JavaScript"]
---

# React Hooks 最佳实践

React Hooks 是 React 16.8 引入的新特性，它让函数组件拥有了状态管理和生命周期的能力。本文将分享一些使用 Hooks 的最佳实践。

## 基础 Hooks

### useState - 状态管理
```jsx
import { useState } from 'react'

function Counter() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <p>当前计数: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        增加
      </button>
    </div>
  )
}
```

**最佳实践：**
- 使用函数式更新避免闭包陷阱
- 合理拆分状态，不要将所有状态放在一个 useState 中

```jsx
// ✅ 推荐：函数式更新
const increment = () => setCount(prev => prev + 1)

// ✅ 推荐：拆分相关状态
const [user, setUser] = useState({ name: '', email: '' })
const [loading, setLoading] = useState(false)

// ❌ 不推荐：所有状态放在一起
const [state, setState] = useState({ 
  user: { name: '', email: '' }, 
  loading: false,
  count: 0 
})
```

### useEffect - 副作用处理
```jsx
import { useEffect, useState } from 'react'

function UserProfile({ userId }) {
  const [user, setUser] = useState(null)

  useEffect(() => {
    let cancelled = false

    async function fetchUser() {
      try {
        const response = await fetch(`/api/users/${userId}`)
        const userData = await response.json()
        
        if (!cancelled) {
          setUser(userData)
        }
      } catch (error) {
        console.error('获取用户信息失败:', error)
      }
    }

    fetchUser()

    return () => {
      cancelled = true
    }
  }, [userId])

  return user ? <div>用户: {user.name}</div> : <div>加载中...</div>
}
```

**最佳实践：**
- 正确设置依赖数组
- 清理副作用避免内存泄漏
- 将相关的副作用放在同一个 useEffect 中

## 进阶 Hooks

### useCallback - 回调函数优化
```jsx
import { useCallback, useState } from 'react'

function TodoList() {
  const [todos, setTodos] = useState([])

  // ✅ 使用 useCallback 优化回调函数
  const addTodo = useCallback((text) => {
    setTodos(prev => [...prev, { id: Date.now(), text, completed: false }])
  }, [])

  const toggleTodo = useCallback((id) => {
    setTodos(prev => 
      prev.map(todo => 
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    )
  }, [])

  return (
    <div>
      <TodoForm onAdd={addTodo} />
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={toggleTodo}
        />
      ))}
    </div>
  )
}
```

### useMemo - 计算结果缓存
```jsx
import { useMemo, useState } from 'react'

function ExpensiveComponent({ items, filter }) {
  const [searchTerm, setSearchTerm] = useState('')

  // ✅ 缓存昂贵的计算结果
  const filteredItems = useMemo(() => {
    return items
      .filter(item => item.category === filter)
      .filter(item => item.name.includes(searchTerm))
      .sort((a, b) => a.name.localeCompare(b.name))
  }, [items, filter, searchTerm])

  return (
    <div>
      <input
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="搜索..."
      />
      {filteredItems.map(item => (
        <div key={item.id}>{item.name}</div>
      ))}
    </div>
  )
}
```

## 自定义 Hooks

自定义 Hooks 是复用状态逻辑的最佳方式：

### useLocalStorage Hook
```jsx
import { useState, useEffect } from 'react'

function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      console.error('读取 localStorage 失败:', error)
      return initialValue
    }
  })

  const setValue = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value
      setStoredValue(valueToStore)
      window.localStorage.setItem(key, JSON.stringify(valueToStore))
    } catch (error) {
      console.error('写入 localStorage 失败:', error)
    }
  }

  return [storedValue, setValue]
}

// 使用示例
function Settings() {
  const [theme, setTheme] = useLocalStorage('theme', 'light')

  return (
    <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
      当前主题: {theme}
    </button>
  )
}
```

### useFetch Hook
```jsx
import { useState, useEffect } from 'react'

function useFetch(url) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false

    async function fetchData() {
      try {
        setLoading(true)
        setError(null)
        
        const response = await fetch(url)
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        
        const result = await response.json()
        
        if (!cancelled) {
          setData(result)
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message)
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    fetchData()

    return () => {
      cancelled = true
    }
  }, [url])

  return { data, loading, error }
}

// 使用示例
function UserList() {
  const { data: users, loading, error } = useFetch('/api/users')

  if (loading) return <div>加载中...</div>
  if (error) return <div>错误: {error}</div>

  return (
    <ul>
      {users?.map(user => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  )
}
```

## Hooks 规则

### 必须遵守的规则
1. **只在顶层调用 Hooks**，不要在循环、条件语句或嵌套函数中调用
2. **只在 React 函数中调用 Hooks**，不要在普通 JavaScript 函数中调用

```jsx
// ❌ 错误示例
function BadComponent({ shouldFetch }) {
  if (shouldFetch) {
    const [data, setData] = useState(null) // 不能在条件语句中调用
  }
  
  for (let i = 0; i < 5; i++) {
    useEffect(() => {}) // 不能在循环中调用
  }
}

// ✅ 正确示例
function GoodComponent({ shouldFetch }) {
  const [data, setData] = useState(null)
  
  useEffect(() => {
    if (shouldFetch) {
      // 在 Effect 内部使用条件逻辑
      fetchData().then(setData)
    }
  }, [shouldFetch])
}
```

## 性能优化技巧

### 1. 避免不必要的重渲染
```jsx
import { memo, useCallback } from 'react'

// 使用 memo 包装组件
const ExpensiveChild = memo(function ExpensiveChild({ onAction, value }) {
  console.log('ExpensiveChild 渲染')
  return <button onClick={onAction}>{value}</button>
})

function Parent() {
  const [count, setCount] = useState(0)
  const [name, setName] = useState('')

  // 使用 useCallback 稳定引用
  const handleAction = useCallback(() => {
    console.log('执行操作')
  }, [])

  return (
    <div>
      <input value={name} onChange={(e) => setName(e.target.value)} />
      <ExpensiveChild onAction={handleAction} value="点击我" />
      <button onClick={() => setCount(c => c + 1)}>计数: {count}</button>
    </div>
  )
}
```

### 2. 合理使用 Context
```jsx
import { createContext, useContext, useState } from 'react'

// 分离频繁变化的状态
const ThemeContext = createContext()
const UserContext = createContext()

function App() {
  const [theme, setTheme] = useState('light')
  const [user, setUser] = useState(null)

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <UserContext.Provider value={{ user, setUser }}>
        <Layout />
      </UserContext.Provider>
    </ThemeContext.Provider>
  )
}

// 创建专用的 Hook
function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider')
  }
  return context
}
```

## 常见陷阱

### 1. 过度使用 useCallback 和 useMemo
```jsx
// ❌ 过度优化
function Component() {
  const [count, setCount] = useState(0)
  
  // 简单值不需要 useMemo
  const doubled = useMemo(() => count * 2, [count])
  
  // 简单函数不需要 useCallback
  const increment = useCallback(() => setCount(c => c + 1), [])
}

// ✅ 合理使用
function Component() {
  const [count, setCount] = useState(0)
  
  // 直接计算简单值
  const doubled = count * 2
  
  // 直接定义简单函数
  const increment = () => setCount(c => c + 1)
}
```

### 2. 依赖数组问题
```jsx
// ❌ 错误：缺少依赖
useEffect(() => {
  console.log(props.value)
}, []) // 缺少 props.value

// ✅ 正确：包含所有依赖
useEffect(() => {
  console.log(props.value)
}, [props.value])
```

## 总结

React Hooks 为我们提供了强大且灵活的状态管理能力。遵循最佳实践，我们可以编写出更清晰、更易维护的React组件：

- 正确使用基础Hooks：useState、useEffect、useContext
- 适时使用性能优化Hooks：useCallback、useMemo
- 创建自定义Hooks复用状态逻辑  
- 遵守Hooks规则，避免常见陷阱
- 不要过度优化，保持代码简洁

掌握这些技巧，你就能充分发挥React Hooks的威力！